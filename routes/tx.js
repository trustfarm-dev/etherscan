const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/25c7c08910c04b0c9be79c09f559652e'))
const addComma = require('../public/js/addComma');
//var Window = document.defaultView;
//document.defaultView = value;




router.get('/:pageId', function (req, res) {
    let pageId = req.params.pageId;
    web3.eth.getTransaction(pageId, false, function (err, tx) {
        if(tx === null){
            return res.redirect(`/error`)
        }
        web3.eth.getTransactionReceipt(pageId, false, async function (err, txReceipt) {
            let value = web3.utils.fromWei(tx.value, 'ether');
            let price = web3.utils.fromWei(tx.gasPrice, 'ether');
            let txFee = web3.utils.fromWei((tx.gasPrice * txReceipt.gasUsed).toString(10))
            web3.eth.getBlock(tx.blockNumber, false, function (err, block) {
                let timestamp = block.timestamp * 1000;
                let date = new Date(timestamp);
                return res.render('tx', {
                    hash: tx.hash, status: txReceipt.status, blockNumber: tx.blockNumber, from: tx.from, to: tx.to, value: value,
                    gasUsed: addComma(txReceipt.gasUsed), gasPrice: price, nonce: tx.nonce, input: tx.input, timestamp: date, txFee: txFee
                })
            })
        })
    })
})


module.exports = router;



