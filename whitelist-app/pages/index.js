import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal';
import { Contract, providers } from 'ethers';
import { WHITELIST_CONTRACT_ADDRESS, ABI } from '../constants/index';


export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdressWhitelisted, setIsAdressWhitelisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noOfWhiteListed, setNoOfWhiteListed] = useState(0);

  const web3ModalRef = useRef();


  const getProviderOrSigner = async (needSigner = false) => {

    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();
      if (chainId != 4) {
        window.alert('Change Network to Rinkeby');
      }

      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;

      } else {

        return web3Provider;
      }

    }
    catch (err) {
      console.error(err);
    }

  }


  const checkIfAddressIsWhiteListed = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, signer);
      const walletAddress = await signer.getAddress();
      console.log(walletAddress);
      const checkIfAddressIsThere = whitelistContract.whiteListedAccounts(walletAddress);
      setIsAdressWhitelisted(checkIfAddressIsThere);
    }
    catch (err) {
      console.log(err);
    }


  }

  const getNumberOfWhitelisted = async () => {
    try {


      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, provider);
      const _whiteListNumCount = await whitelistContract.whiteListNumCount();
      setNoOfWhiteListed(Number(_whiteListNumCount));
      console.log('_whiteListNumCount=', _whiteListNumCount);
    }
    catch (err) {
      console.log(err);
    }

  }

  const addAddressToWhiteist_ = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, ABI, signer);

      const txnObject = await whitelistContract.addAddressToWhiteList();
      setLoading(true);
      await txnObject.wait();
      setLoading(false);
      setIsAdressWhitelisted(true);
      await getNumberOfWhitelisted();
    }
    catch (err) {
      console.log(err);
    }

  }

  const connectWallet = async () => {
    try {
      const provider = await getProviderOrSigner(false);
      checkIfAddressIsWhiteListed();
      getNumberOfWhitelisted();
      setIsConnected(true);
    }
    catch (err) {
      console.log(err);
    }

  }



  useEffect(() => {
    if (!isConnected) {
      web3ModalRef.current = new Web3Modal({ network: "rinkeby", providerOptions: {}, disableInjectedProvider: false });
    }
    connectWallet();

  }, [isConnected]);

  const renderButton = () => {
    if (isConnected) {
      if (isAdressWhitelisted) {
        return (
          <div className={styles.button}>
            Thanks for joining!
          </div>
        );
      }
      else if (loading) {
        return (
          <div className={styles.button}>
            Loading....
          </div>
        );
      }
      else {
        return (
          <div className={styles.button}>
            <button onClick={addAddressToWhiteist_}>
              Join the Whitelist
            </button>
          </div>
        );
      }
    }
    else {
      <div className={styles.button}>
        <button onClick={connectWallet()}>Connect to Wallet</button>
      </div>
    }
  };


  return (
    <div className={styles.mainClass}>
      <div className={styles.container}>
        <Head>
          <title>WhiteList dApp</title>
          <meta name="description" content="WhiteList dApp" />
        </Head>

        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            {noOfWhiteListed} have already joined the Whitelist
          </div>
          <div>
            <img className={styles.image} src='./crypto-devs.svg' />
          </div>
        </div>
        <div className={styles.buttonClass}>
          {renderButton()}
        </div>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div >
    </div>
  );
}
