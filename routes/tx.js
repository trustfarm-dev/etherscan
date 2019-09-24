const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'))

function addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}

router.get('/:pageId', function(req, res){
    let pageId = req.params.pageId;
    web3.eth.getTransaction(pageId, false, function(err, tx) {
        web3.eth.getTransactionReceipt(pageId, false, function(err, txReceipt){
            let value = web3.utils.fromWei(tx.value, 'ether');
            let price = web3.utils.fromWei(tx.gasPrice, 'ether');
            
            return res.render('tx', {hash: tx.hash, status: txReceipt.status, blockNumber: tx.blockNumber, from: tx.from, to: tx.to, value: value,
                gasUsed: addComma(txReceipt.gasUsed), gasPrice: price, nonce: tx.nonce, input: tx.input})
        })
    })
})


module.exports = router;