import {useEffect, useRef, useState} from 'react';
import { useMoralis} from "react-moralis";
import Image from 'next/image';
import { Web3Auth } from "@web3auth/web3auth";
import {Router} from "next/router";
import userDefaultAvatar from '../assets/user.png';
import Chevron from '../assets/chevron.svg';
import useOutsideClick from "../hooks/useOutsideClick";

export default function Account() {
    const ref = useRef(null);

    const {
        Moralis,
        user,
        logout,
        authenticate,
        isAuthenticated,
    } = useMoralis();

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    console.log(user?.attributes);

    const profilePicture = user?.attributes.profile_picture;

    useEffect( () => {
        if (!isAuthenticated) {
            const auth = async () => {
                await authUser();
            }

            auth();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const loadEmail = async () => {
                try {
                    const web3Auth = new Web3Auth({
                        clientId: 'BKNZR_vNmy3w-Ni4p2q1-RX-xq00yFvutjahw_TuAQJps7Xd-2d_dV9AlRO_Mz7tSWgjMjdcbfhrQ9QNXXouWNI',
                        chainConfig: {
                            chainNamespace: 'eip155',
                            chainId: "0x61",
                            rpcTarget: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                            displayName: "Binance testnet",
                            blockExplorer: 'https://testnet.bscscan.com',
                            ticker: 'BNB',
                            tickerName: 'Binance',
                        }
                    });

                    await web3Auth.initModal();

                    const userInfo = await web3Auth.getUserInfo();

                    if (userInfo.email) {
                       const isEmail = await Moralis.Cloud.run('searchEmail', {
                           email: userInfo.email,
                           ethAddress: address,
                       });

                       if (isEmail) {
                           const { id } = user;

                           await logout();
                           const result = await Moralis.Cloud.run('deleteRecord', {
                               id
                           })

                           if (result) {
                               alert('This email already exist');
                               Router.push('/')
                           }
                       } else {
                           const { id } = user;
                           const result = await Moralis.Cloud.run('addEmail', {
                               id,
                               email: userInfo.email,
                           })

                           if (result) {
                               // setShowEmailInput(false);
                               Router.push('/');
                           }
                       }
                    } else {
                        if (!user.attributes.email) {
                            // setShowEmailInput(true);
                        } else {
                            Router.push('/');
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            loadEmail();
        }
    }, [isAuthenticated, Router, logout, user]);

    const getUserName = () => {
      if (user && user.attributes.nickname) {
          return user.attributes.nickname;
      }

      const { ethAddress } = user?.attributes;

      return `${ethAddress?.slice(0, 6)}...${ethAddress?.slice(-4)}`
    };


    const authUser = async () => {
        await authenticate({
            provider: 'web3Auth',
            chainId: '0x61',
            theme: 'light',
            clientId: 'BKNZR_vNmy3w-Ni4p2q1-RX-xq00yFvutjahw_TuAQJps7Xd-2d_dV9AlRO_Mz7tSWgjMjdcbfhrQ9QNXXouWNI',
        })
    }

    const openUserMenu = () => {
        setUserMenuOpen(true);
    }

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    }

    useOutsideClick(ref, closeUserMenu);

    return (
        isAuthenticated ? (
            <div ref={ref} className="relative flex items-center justify-center">
                <Image
                    src={profilePicture ?? userDefaultAvatar}
                    width="40px"
                    height="40px"
                    className="rounded-full bg-[#90e040]"
                    alt="profile picture"
                />
                <p className="ml-3 hidden sm:block uppercase mr-2.5">
                    {getUserName()}
                </p>
                <button onClick={openUserMenu}>
                    <Chevron className="w-3.5 h-1.5 fill-transparent stroke-[#242424] grow" />
                </button>
                {/*user menu*/}
                {userMenuOpen && (
                    <div className="absolute flex py-4 px-4 top-16 w-40 bg-[#242424] text-white rounded-lg">
                        <button onClick={() => logout()}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        ) : (
                <button
                    onClick={authUser}
                    type="button"
                    className="flex items-center bg-[#3985F5] py-4 px-6 rounded-lg ml-20 text-white uppercase h-10"
                >
                    authenticate
                </button>
            )
    );
}

