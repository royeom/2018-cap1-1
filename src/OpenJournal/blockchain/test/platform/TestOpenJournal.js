const JournalToken = artifacts.require("./Token/JournalToken.sol");
const OpenJournal = artifacts.require("./OpenJournal.sol")

const expect = require('chai').expect;

contract('OpenJournal Test', function(accounts) {

	let journalToken;
  let openJournal;
  let signup1;
  let signup2;
  let regist1;
  let regist2;  
  let subscribe1;
  let subscribe2;

	let master = accounts[0];
  let register1 = accounts[1];
  let register2 = accounts[2];
  let register3 = accounts[3];
  let subscriber1= accounts[4];
  let subscriber2= accounts[5];

  let reference1 = [201803210120,201805190006];
  let reference2 = [];

	beforeEach(async function () {       
    openJournal = await OpenJournal.new(0, 30, 10, 5, 80);
    await openJournal.buyToken({from : master, value : 50});
    signup1 = await openJournal.signUp({from:subscriber1});
    signup2 = await openJournal.signUp({from:subscriber2});
    regist1 = await openJournal.registJournal(201701050020, 'Journal 1', 10, reference1, {from:register1}); 
    regist2 = await openJournal.registJournal(201803210120, 'Journal 2', 10, reference2, {from:register2});
    regist3 = await openJournal.registJournal(201805190006, 'Journal 3', 10, reference2, {from:register3});   
    subscribe1 = await openJournal.subscribeJournal(201701050020, {from:subscriber1});
    subscribe2 = await openJournal.subscribeJournal(201803210120, {from:subscriber1});
    subscribe3 = await openJournal.subscribeJournal(201803210120, {from:subscriber2});
  
	});

  it('should be possible to sign up', async function () {
    let balance0 = await openJournal.balanceOf.call(accounts[0]);
    let balance1 = await openJournal.balanceOf.call(accounts[1]);
    let balance2 = await openJournal.balanceOf.call(accounts[2]);
    let balance3 = await openJournal.balanceOf.call(accounts[3]); 
    let balance4 = await openJournal.balanceOf.call(accounts[4]); 
    let balance5 = await openJournal.balanceOf.call(accounts[5]); 

    let log_1 = signup2.logs[0];
    let from_1 = log_1.args._from;
    let to_1 = log_1.args._to;
    let value_1 = log_1.args._value;  

    let log_2 = signup2.logs[1];
    let subscriber_number_2 = log_2.args._subscriber_number;
    let subscriber_address_2 = log_2.args._subscriber_address;
    let subscriber_journal_2 = log_2.args._subscriber_journal;

    expect(balance0.toString()).to.equal('49940');
    expect(balance1.toString()).to.equal('8');
    expect(balance2.toString()).to.equal('21');
    expect(balance3.toString()).to.equal('1');
    expect(balance4.toString()).to.equal('10');
    expect(balance5.toString()).to.equal('20');

    expect(from_1.toString()).to.equal(accounts[0]);
    expect(to_1.toString()).to.equal(accounts[5]);
    expect(value_1.toString()).to.equal('30');

    expect(subscriber_number_2.toString()).to.equal('2');
    expect(subscriber_address_2.toString()).to.equal(accounts[5]);
    expect(subscriber_journal_2.toString()).to.equal('');
  });

  it('should be possible to regist journal', async function () {
    let log_1 = regist1.logs[0];
    let number_1 = log_1.args._number;
    let author_1 = log_1.args._author;
    let title_1 = log_1.args._title;
    let value_1 = log_1.args._value;
    let reference_1 = log_1.args._reference;    

    let log_2 = regist2.logs[0];
    let number_2 = log_2.args._number;
    let author_2 = log_2.args._author;
    let title_2 = log_2.args._title;
    let value_2 = log_2.args._value;
    let reference_2 = log_2.args._reference;

    expect(author_1.toString()).to.equal(accounts[1]);
    expect(author_2.toString()).to.equal(accounts[2]);
    expect(reference_1.toString()).to.equal("201803210120,201805190006");
    expect(reference_2.toString()).to.equal("");
  });

  it('should be possible to subscribe journal', async function () {
    let log_1 = subscribe2.logs[0];
    let from_1 = log_1.args._from;
    let to_1 = log_1.args._to;
    let value_1 = log_1.args._value;

    let log_2 = subscribe1.logs[1];
    let subscriber_1 = log_2.args._subscriber;
    let myjournals_1 = log_2.args._myjournals;
    let subscribed_1 = log_2.args._subscribed;
    let is_subscribed_1 = log_2.args._is_subscribed;
    let author_value_1 = log_2.args._author_value;
    let ref_value_1 = log_2.args._ref_value;
    let ref_length_1 = log_2.args._ref_length;

    let log_3 = subscribe2.logs[1];
    let subscriber_2 = log_3.args._subscriber;
    let myjournals_2 = log_3.args._myjournals;
    let subscribed_2 = log_3.args._subscribed;
    let is_subscribed_2 = log_3.args._is_subscribed;
    let author_value_2 = log_3.args._author_value;
    let ref_value_2 = log_3.args._ref_value;
    let ref_length_2 = log_3.args._ref_length;

    expect(from_1.toString()).to.equal(subscriber1);
    expect(to_1.toString()).to.equal(register2);
    expect(value_1.toString()).to.equal('10');

    expect(subscriber_1.toString()).to.equal(subscriber1);
    expect(myjournals_1.toString()).to.equal("1,2");
    expect(subscribed_1.toString()).to.equal("1");
    expect(is_subscribed_1.toString()).to.equal("true");
    expect(author_value_1.toString()).to.equal("0.8");
    expect(ref_value_1.toString()).to.equal("0.2");
    expect(ref_length_1.toString()).to.equal("2");

    expect(subscriber_2.toString()).to.equal(subscriber2);
    expect(myjournals_2.toString()).to.equal('2');
    expect(subscribed_2.toString()).to.equal('1,2');
    expect(is_subscribed_2.toString()).to.equal('true');
    expect(author_value_2.toString()).to.equal('0.8');
    expect(ref_value_2.toString()).to.equal('0.2');
    expect(ref_length_2.toString()).to.equal('0');
    
  });
/*
  it('should be possible get journal register', async function() {
    get_auth = await openJournal.getAuthorAddress(1);
    let log_1 = get_auth.logs[0];
    let number_1 = log_1.args._number;
    let author_1 = log_1.args._author;

    expect(number_1.toString()).to.equal('1');
    expect(author_1.toString()).to.equal(register1);
  })

  it('should be possible get journal value', async function() {
    get_value = await openJournal.getValue(1);
    let log_1 = get_value.logs[0];
    let number_1 = log_1.args._number;
    let value_1 = log_1.args._value;

    expect(number_1.toString()).to.equal('1');
    expect(value_1.toString()).to.equal('10');
  })

  it('should be possible to show journals of subscriber', async function () {
    let result1 = await openJournal.showSubscribedJournal({from:subscriber1});
    let result2 = await openJournal.showSubscribedJournal({from:subscriber2});

    expect(result1.toString()).to.equal('1,2');
    expect(result2.toString()).to.equal('2');
  });

  it('should be possible to show subscribers of journal', async function () {
    let result1 = await openJournal.showJournalSubscriber(1);
    let result2 = await openJournal.showJournalSubscriber(2);

    expect(result1.toString()).to.equal('1');
    expect(result2.toString()).to.equal('1,2');
  }); 
*/
});
