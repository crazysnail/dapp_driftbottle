import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

//const contractAddress = "0x0501005C9B6e2FA5B91f0f086EB08C05E0c489e1"; // SimpleStorage  
const contractAddress = "0xb49f430d08cbb9ce3954431116b179dfcd21b23e"; // SetGet  

 // Declaring this for later so we can chain functions on SimpleStorage.
 var simpleStorageInstance

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)


    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      //simpleStorage.deployed().then((instance) => {
      simpleStorage.at(contractAddress).then((instance) => {  
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return ;//simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
        <input ref="myvalue" className="myinput"/>
                <button
                    className="mybutton"
                    onClick={() => {
                        var num = Number(this.refs.myvalue.value);
                        console.log("点击了button");
                        console.log(num);
                        simpleStorageInstance.set(num, {from: this.state.web3.eth.accounts[0]}).then(() => {
                            console.log("数据修改成功");
                            simpleStorageInstance.get.call(this.state.web3.eth.accounts[0]).then((result) => {
                                console.log("数据读取成功");
                                console.log(result);
                                // 修改状态变量的值，在react中，一旦状态变量的值发生变化，就会调用render函数重新渲染UI
                                this.setState({ storageValue: result.c[0] })
                            });

                        })

                    }}
                    style={{height: 40,marginLeft: 50}}>修改合约数据</button>

      </div>
    );
  }
}

export default App
