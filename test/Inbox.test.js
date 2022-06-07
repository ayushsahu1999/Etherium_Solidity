const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {abi, evm} = require('../compile');
const INITIAL_MESSAGE = 'Hi There!'

let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(abi).deploy({
        data: evm.bytecode.object,
        arguments: [INITIAL_MESSAGE],
    }).send({from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
    it('Deploys a contract', () => {
        // console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});