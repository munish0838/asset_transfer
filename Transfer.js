import React, {useRef, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import HTLC from "./res/HTLC_Final.json";
import Identicon from 'react-identicons'
import logo from './res/blockchain.svg';
import bg from './res/doodle_blockchain.jpg';
import Popup from 'reactjs-popup';
import Navbar from './Navbar';
// import Date;
import 'reactjs-popup/dist/index.css';
import Asset_transfer  from "./contracts/Asset_transfer.json"
import credentials from "./Credentials.json";
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
{/* <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script> */}

class Transfer extends Component {
// function Transfer() {



    // const ref = useRef();
    loadWeb3 = async() => {
      
        const network = this.state.chain

        if (network === 'Ethereum') {
          if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
            // window.alert("Ethereum connected")
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

    
      loadBlockchainData = async()  => {
        console.log("hello function")
        const network = this.state.chain
        console.log(network)
        if (network === "ETH"|| network === "BNB") {
        const web3 = window.web3 
        console.log("web3")
        console.log(web3)
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({ account: accounts[0] })
        console.log(this.state.account)
        // console.log("nnnnnnnnnnbbbbbbbbbbb")
        const networkId = await web3.eth.net.getId()
        console.log(networkId)
        this.setState({ networkId })
          const networkData = Asset_transfer.networks[networkId]
          console.log(networkData)
          if (networkData) {
            const asset = new web3.eth.Contract(Asset_transfer.abi, networkData.address)
            console.log("Hello world")
            this.setState({ asset })
          } else {
            window.alert('SwapContract not deployed to detected network.')
          }    
          this.setState({ loading: false })
          console.log("Load block chain called successfully")
        }
        else{
          window.alert("Wrong chain connected")
        }
      }


      



    checkEthAddress(address) {
        if (address.length === 42 && address[0] === '0' && address[1] === 'x') {
          for (let i = 2; i < 42; i++) {
            if (!((address[i] >= '0' && address[i] <= '9') || (address[i] >= 'a' && address[i] <= 'f') || (address[i] >= 'A' && address[i] <= 'F'))) {
              return false;
            }
          }
        } else {
          return false;
        }
        return true;
    }

    
    getKeccakHash  (secret)  {
        const keccak256 = require('keccak256')
        const secretHash = "0x" + keccak256(secret).toString('hex');
        return (secretHash);
      }

    sendEmail  (mail, txId)  {
      console.log("Email fxn begin")
        const ele = document.getElementById("receiverChain");
        const recvChain = ele.options[ele.selectedIndex].text;
        const body = "The transaction Id of the transaction involving your wallet address on " + this.state.chain + " blockchain (" + this.getNetworkName() + " Network) is " + txId + ". You are Requested by sender to send funds on " + recvChain + " Blockchain ( " + this.receiverNet + " Network ). For more details please visit the website and open 'Respond' tab."
        window.Email.send({
          Host: credentials.Host,
          Username: credentials.Username,
          Password: credentials.Password,
          To: mail,
          From: credentials.From,
          Subject: credentials.Subject,
          Body: body
        })

        return 0;
          // .then(function (message) {
          //   console.log(message)
          // });
      }


      constructor(props) {
        super(props)
        this.state = {
          account: '',
          loading: true,
          chain: 'Ethereum'
        }
      }


    getFinalityTime  (chain, network)  {
        if (chain === 'Ethereum' || chain === 'ETH') {
          
		  /*if (network === "Ropsten") {
            return 150 //ropsten network time, to be changed as per according to mainnet analysis
          } if (network === "Kovan") {
            return 60
          } if (network === "Rinkeby") {
            return 90
          } */ 
		  if (network === "Goerli") {
            return 720          //blocktime=12s and finality time =12-15 minutes
          }
      else{
        return 30;
      }
        }
        else if (chain === 'Binance') {
          return 60;         //block time=3s and finality time ~1 minute.
        
        }
        else{
          return 30;
        }
      }

    getFinalityBlocks(){
      if(this.state.chain === "Ethereum"){
        return 64;
      }
      else{
        return 20;
      }
    }
    getNetworkName() {
		
		                   //keep only goerli and binance
		
        if (this.state.chain === 'Ethereum') {
          // if (this.state.networkId === 3) {
          //   return "Ropsten"
          // } if (this.state.networkId === 42) {
          //   return "Kovan"
          // } if (this.state.networkId === 4) {
          //   return "Rinkeby"
           if (this.state.networkId === 5) {
            return "Goerli"
          } if (this.state.networkId === 5777) {
            return "Ganache"
          }
        }
        else if (this.state.chain === 'Binance') {
          if (this.state.networkId === 97) {
            return "Smart Chain Testnet"
          }
        }
      }

    linkAccount = async (e) => {
        e.preventDefault();
        console.log("Link account function called")
        const chainName = document.getElementById("senderChain").value;
        this.setState({ chain: chainName });
        console.log(chainName)
    
        await this.loadWeb3()
        await this.loadBlockchainData()
      }



      // ========================


      
      
    sendFunds = async(amountFunded, receiverAddress,  secretHash, amountExpected, receiverEmailId) => {
    this.setState({ loading: true })
    console.log("Send function called at top")
    for (var i = 0; i < amountFunded.length; i++) {
      if (!((amountFunded[i] >= '0' && amountFunded[i] <= '9') || amountFunded[i] === '.')) {
        window.alert("Invalid Amount Entered")
        this.setState({ loading: false })
        return;
      }
    }

    if (this.state.chain === "Ethereum") {
      if (this.checkEthAddress(receiverAddress) === false) {
        window.alert("Invalid Ethereum Receiver address.");
        this.setState({ loading: false });
        return;
      }
    }
    // else if (this.state.chain === "Smart Chain - Testnet") {
    //   if (this.checkTronAddress(receiverAddress) === false) {  // CHANGE FOR BINANCE SMART CHAIN
    //     window.alert("Invalid Binance Receiver address.");  // =======================================
    //     this.setState({ loading: false });
    //     return;
    //   }
    // }

    const dropDown = document.getElementById("receiverChain");
    const chainName = dropDown.options[dropDown.selectedIndex].text;

    // if (chainName === "Ethereum") {
      // if (this.checkEthAddress(expectedAddress) === false) {
      //   window.alert("Invalid Ethereum Expected address.");
      //   this.setState({ loading: false });
      //   return;
      // }
    // }

    // else if (chainName === "Smart Chain - Testnet") {
    //   if (this.checkTronAddress(expectedAddress) === false) {  // CHANGE FOR BINANCE SMART CHAIN
    //     window.alert("Invalid Binance Expected address.");  // =========================================
    //     this.setState({ loading: false });
    //     return;
    //   }
    // }


    //   FUNTION CHECKING VALID SECRET HASH OR NOT
    console.log("byeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    if (secretHash.length === 66 && secretHash[0] === '0' && secretHash[1] === 'x') {
      for (i = 2; i < 64; i++) {
        if (!((secretHash[i] >= '0' && secretHash[i] <= '9') || (secretHash[i] >= 'a' && secretHash[i] <= 'f') || (secretHash[i] >= 'A' && secretHash[i] <= 'F'))) {
          window.alert("Invalid Secret Hash Entered")
          this.setState({ loading: false })
          return;
        }
      }
    } else {
      window.alert("Invalid Secret Hash Entered")
      this.setState({ loading: false })
      return;
    }


    // FUNCTION CHECKING VALID EMAIL ID REGEX CHECK
    if (emailRegex.test(receiverEmailId) === false) {
      window.alert("Invalid Receiver Email Id Entered")
      this.setState({ loading: false })
      return;
    }
    
    function e2w(val) {
      var one = val * 10 **18;
      val = one;
      val.toString();
      console.log("Wei: " + val * 10 ** 18);
    }


    // TIME LOCK DEFINED BUT WE NEED TO GET FINALITY TIME HERE 
	

	
	//lock time/waiting time (T1+T2) is only needed when we need to call reclaim, there we will check if t1+t2/ time_lock is over then only reclaim can be called. 
	
	
    const lockTime =  Math.max(this.getFinalityTime(this.state.chain, this.getNetworkName()), this.getFinalityTime(this.receiverCrypto, this.receiverNet));
	// if (this.state.chain === "Ethereum" || this.state.chain === "Binance") {
      
      // expectedAddress = "0x" + expectedAddress.substring(2);
      // console.log(expectedAddress)

        console.log("hello")
          console.log(this.network)

      console.log(this.state)
      console.log(this.state.asset)
      console.log(this.state.asset.methods.options)
      

      console.log(this.fundAmount.value)
      console.log(this.state.chain)

      // this.fundAmount.value = (this.fundAmount.value.toString())

      console.log(this.fundAmount.value)
      console.log(this.state.account)

      console.log(this.fundAmount.value)
      console.log(receiverAddress)

      console.log(this.fundAmount.value)
      console.log(this.state.account)
      e2w(amountFunded)



      const web3 = window.web3 
      // const weiValue = web3.utils.towei(amountFunded, 'wei');
      console.log("Account balance is")
      
      const value_bal = await web3.eth.getBalance(this.state.account)
      console.log(value_bal)
      // console.log(weiValue)
      console.log(amountFunded)


      console.log("Entering methiod now")
            // DO EDITS HERE FOR OUR SEND FUNCTION TO SEND TRANSACTION HASH TO OTHER CONTRACT/BLOCK CHAIN   }
      this.state.asset.methods.Asset_burn(this.state.chain, receiverAddress, secretHash ).send( { from: this.state.account, value: amountFunded})
      .then( async(result) => 

      {
        console.log("ge")
        const txnId =  await result.events.fundsburned.returnValues._currentTransactionId
        console.log("txn id is ", txnId)
        // console.log(recepit)
        // console.log("Id id")
        // console.log(recepit.events.fundsburned)
        // const txnId = recepit.events.fundsburned.transactionIndex

        
          // receiverAddress = "0x000000000000000000000000000000000000dead"

          // const txId = await  result.events.fundReceived.returnValues._currentTransactionId


        // if(err){
        //   console.log("Error in transactions")
        // }
        console.log("Hello tx")
        console.log(result)
        console.log("current burn id is", txnId)
        console.log(await this.state.asset.methods.get_txn_details(txnId))
        // THE RESULT IS OUR TRANSACTION HASH
        console.log(amountFunded)
        console.log("In the function we are")
        // console.log(result)
        console.log("end")
        const web3 = window.web3 
        // const txr = await web3.eth.getTransaction(result)
        // console.log(await web3.eth.getPendingTransactions)
        // console.log(txr)

        // console.log(txr.blockNumber)
        // console.log(txId)

        // const txnRcp = await web3.eth.getTransactionReceipt(result)
        // console.log(txnRcp) // THIS HAS ALL INFO OF TRANSACTION THAT WE NEED

        // TRANSACTION INDEX AND 
        


        console.log("Value")

        var confTime = this.getFinalityTime(this.state.chain, this.getNetworkName(this.state.chain));

        function sleep(confTime) {
          var start = new Date().getTime();
          while (new Date().getTime() < start + confTime);
        }

        // const block = await web3.eth.getBlockNumber();
        // console.log(block)

        // const txnBlock = txnRcp.blockNumber

        // console.log(txnRcp.status)
        // if(txnRcp.status){
          console.log("In function")
          sleep(confTime)
          const init_block = await web3.eth.getBlockNumber();
          var curBlock = await web3.eth.getBlockNumber();
          const new_blocks = this.getFinalityBlocks();
          while(curBlock< init_block+new_blocks){
            curBlock = await web3.eth.getBlockNumber();
          }
        await this.state.asset.methods.burntverified(txnId).send({ from: this.state.account})
        const details = await this.state.asset.methods.get_txn_details(txnId).call()
        console.log(details)
          // const block = web3.eth.getBlockNumber();
          // if(block - txnBlock >= 24){
            console.log("inside verification")
            // const txId = txnRcp.transactionIndex
            // this.state.asset.methods.burntverified(txId).call() 
            // SEND EMAIL ALSO
          
          
        })

        // const txId = txnRcp.transactionIndex
        // console.log(this.state.asset.methods.get_txn_details(txId))

        // while(newBlock <  24 || newTime < inTime + this.getFinalityTime(this.state.chain)){
        //     newTime = Date.time();
        //     newBlock = Web3.eth.getBlockNumber();
        // }
        
        // if(Web3.eth.getBlockNumber() >= initBlock + 24){
        //   (this.state.asset.methods.burntverified(txId))
        // this.sendEmail(receiverEmailId, txId)
        // this.setState({ loading: false })
        // }
      
        
      // }, e => {
      //   window.alert("Transaction Failed")
      //   this.setState({ loading: false })
      // })
    // }


    // else if (this.state.chain === "Binance") { // -==================== BINANCE SMART CHAIN
    //   // function Asset_burn(string memory _BCName, address _recipient, bytes32 _secretHash)
    //   this.state.asset.methods.Asset_burn(this.state.chain, receiverAddress, secretHash ).send({ from: this.state.account, callValue: amountFunded, shouldPollResponse: true }).then((res) => {
    //     const txId = result.events.fundReceived.returnValues._currentTransactionId  // WE HAVE GOT TRANSACTION ID HERE ===============
    //     window.alert("Your Unique Transaction Id is : " + txId)
    //     this.sendEmail(receiverEmailId, txId)
    //     this.setState({ loading: false });
    //   }, e => {
    //     window.alert("Transaction Failed")
    //     this.setState({ loading: false })
    //   })
    // }

  }

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

                

                <form onSubmit={(event) => {
                          event.preventDefault()
                          const receiverEmailId = this.receiverEmailId.value
                          const secretHash = this.secretHash.value
                          const amountFunded = this.fundAmount.value
                          
                          const amountExpected = this.conversionRate * amountFunded
                          const receiverAddress = this.addressOfReceiver.value 
                          // const expectedAddress = this.expectedAddress.value
                          this.sendFunds(this.fundAmount.value, receiverAddress,  secretHash, amountExpected,  receiverEmailId)
                          // sendFunds = async(amountFunded, receiverAddress,  secretHash, amountExpected, receiverEmailId) => {

                        }}>

                    <div className="form-group my-4">
                          <div className="float-left">Sender Blockchain Network</div>
                          <select class="form-control" id="senderChain"  onChange={(e) => { this.linkAccount(e)}} >
                            <option value= 'Select Network'>Select Network...</option>
                            <option value='ETH'>Ethereum</option>
                            <option value='BNB'>Binance</option>
                          </select>
                          <small className="form-text text-muted">Blockchain on which you have tokens</small>
                    </div>

                    <div className="form-group my-4">
                          <div className="float-left">Receiver Blockchain</div>
                          <select class="form-control" id="receiverChain" >
                            {/* onChange={(e) => { this.receiverCrypto = e.target.value; document.getElementById('crypto2').innerHTML = e.target.value; this.getNetworkOptions(e.target.value); if (this.senderCrypto !== undefined) { this.getConversionRate(); } }} */}
                            <option value= 'Select Network'>Select Network...</option>
                            <option value='ETH'>Ethereum</option>
                            <option value='BNB'>Binance</option>
                          </select>
                          <small className="form-text text-muted">Blockchain on which you want to receive Funds</small>
                    </div>

                    
                    <div className="form-group my-4">
                        <div className="float-left">Address of  Receiver</div>
                        <input className="form-control" id = "addressOfReceiver" type = "text" placeholder ="Type receiver address here " ref={(input) => { this.addressOfReceiver = input }} required />
                    </div>
                    

                    <div className="form-group my-4">
                        <div className="float-left">Email Id of Receiver</div>
                        <input id="email" className="form-control" type="email" placeholder="Enter Receiver's Email Id " ref={(input) => { this.receiverEmailId = input }}  required />
                        {/*  */}
                    </div>

                    <div className="form-group my-4">
                          <div className="float-left">Amount</div>
                          <input id="fundAmount" className="form-control" type="text" placeholder="Amount Of Funds You Want To Send"  ref={(input) => { this.fundAmount = input }} required />
                          {/*  */}
                    </div>

                    <div className="form-group my-4">
                          <div className="float-left">Secret Key</div>
                          <input  className="form-control" type="text" placeholder="Enter your secret key" onChange={(e) => { document.getElementById('keccakHash').textContent = this.getKeccakHash(e.target.value) }} />
                          
                          <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textOverflow: 'ellipsis' }} id='keccakHash'></p>
                          <p><button class="btn btn-sm" onClick={() => { document.getElementById('secretHash').value = document.getElementById('keccakHash').textContent; }}><i class="fa fa-fw fa-copy"></i> Click to copy hash</button></p>
                          <input id="secretHash" className="form-control" type="text" placeholder="Hash Value of the Secret key using Keccak256 function" ref={(input) => { this.secretHash = input }} required />
                          
                    </div>


                    <button style={{ fontSize: 20 }} className="btn btn-info btn-sm my-4">Send Funds</button>


                </form>
            </div>
        );};
    }

export default Transfer;