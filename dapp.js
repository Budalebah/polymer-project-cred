const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const INFURA_KEY = "";  // Sepholia ağında Infura anahtarınızı ekleyin
const web3 = new Web3('https://sepholia.infura.io/v3/' + INFURA_KEY); 
const account = ''; // Metamask cüzdan adresinizi ekleyin
const privateKey = Buffer.from('', 'hex'); // İşlemi imzalamak için özel anahtarınızı ekleyin
const contract_Address = ""; // Yayınlanan akıllı kontrat adresinizi ekleyin
const abi = []; // Akıllı kontratın ABI'sini ekleyin
const contract = new web3.eth.Contract(abi, contract_Address); // Akıllı kontratı başlat

function signTransaction(smartContractFunction) {
    web3.eth.getTransactionCount(account, (err, txCount) => {
        web3.eth.getGasPrice(function(e, r) {
            const txObject = {
                nonce: web3.utils.toHex(txCount),
                to: contract_Address,
                value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
                gasLimit: web3.utils.toHex(2100000),
                gasPrice: web3.utils.toHex(r),
                data: smartContractFunction
            }
            const tx = new Tx(txObject, { chain: 'sepholia' }); // Sepholia ağını belirtin
            
            tx.sign(privateKey);

            const serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
                console.log(receipt);
            });
        });
    });
}

function createProject(projectName, projectDescription) {
    const smartContractFunction = contract.methods.create(projectName, projectDescription).encodeABI();
    signTransaction(smartContractFunction);
}

function readProject(projectId) {
    contract.methods.read(projectId).call().then(function(result) {
        console.log(result);
    });
}

function updateProject(projectId, projectName, projectDescription) {
    const smartContractFunction = contract.methods.update(projectId, projectName, projectDescription).encodeABI();
    signTransaction(smartContractFunction);
}

function deleteProject(projectId) {
    const smartContractFunction = contract.methods.destroy(projectId).encodeABI();
    signTransaction(smartContractFunction);
}

createProject('Project Sepholia', 'Exciting project in the Sepholia network');
//readProject(1);
//updateProject(1, 'Updated Project Sepholia', 'Updated description');
//deleteProject(1);
