import React, { useState, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Navbar';
import {Link} from "react-router-dom";
import Web3 from 'web3';
import Asset_transfer  from "./contracts/Asset_transfer.json"

class Home extends Component {


  
    loadWeb3 = async() => {
        const network = this.state.chain
        if (network === 'Ethereum') {
          if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
          }
          else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
          }
          else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
        }
        // Binance wallet check assuming same functions as in ethereum
        else if (network === 'Binance') {
          if (document.readyState === "complete") {
            window.web3 = new Web3(window.BinanceChain);
            console.log("BinanceWallet present")
            }
          else {
            window.alert('BNB wallet not detected. You should consider trying Tronlink!')
          }
        }
      }

    
       loadBlockchainData = async() => {
        const network = this.state.chain


        if (network === "Ethereum"|| network === "Binance") {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        this.setState({ networkId })
          const networkData = Asset_transfer.networks[networkId]
          if (networkData) {
            const asset = new web3.eth.Contract(Asset_transfer.abi, networkData.address)
            this.setState({ asset })
          } else {
            window.alert('SwapContract not deployed to detected network.')
          }    
          this.setState({ loading: false })
        }
      }

      

        // useEffect(() =>{
        //     loadWeb3();
        //     loadBlockchainData();
        // });
      render(){
        return(
            <div>
                <div>
                    <ul>
                        <li><Link to = "/">Home</Link></li>
                        <li><Link to = "/Transfer">Transfer</Link></li>
                        <li><Link to = "/Mint">Mint</Link></li>
                    </ul>
                </div>
               
                <h4> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat velit, pretium ac mauris sit amet, lobortis mollis tellus. 
                    Praesent facilisis tellus pharetra elementum interdum. Nam nec enim sit amet enim iaculis laoreet. Quisque mattis rhoncus mi, 
                    sed mattis quam. Sed vel pharetra nibh, at aliquet elit. Sed pharetra porta turpis, a auctor diam ultricies at. Aliquam pellentesque 
                </h4>
            </div>
        );
      }
    }
export default Home;