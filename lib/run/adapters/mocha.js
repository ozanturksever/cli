import BaseAdapter from './base';

const {mocha} = window;

function gatherSuites(test){
  let suite = test.parent;
  let suites = [];

  while (!suite.root) {
    suites.push(suite.title);
    suite = suite.parent;
  }

  return suites.reverse();
}

function serializeTest(test){
  return {
    name: test.title,
    path: gatherSuites(test),
    passing: test.state === 'passed',
    failing: test.state === 'failed',
    skipped: test.pending,
    duration: test.duration,
    errors: [test.$error].filter(Boolean)
  };
}

function gatherTests(suite){
  return [].concat(
    suite.tests.map(serializeTest),
    ...suite.suites.map(gatherTests)
  );
}

const mochaStackReg = /\n.+\/mocha\/mocha\.js\?\w*:[\d:]+\)?(?=(\n|$))/g;

function serializeError(err){
  let {name, message, stack} = err;

  if (stack) {
    // remove mocha stack entries
    stack = stack.replace(mochaStackReg, '');
  }

  // formatted error
  return {name, message, stack};
}

export default class MochaAdapter extends BaseAdapter {
  init({ui = 'bdd'} = {}){
    const grep = window.localStorage.getItem('grep')
    if(grep) {
      mocha.setup({ui, grep:new RegExp("^"+grep)});
      window.localStorage.removeItem('grep')
    } else {
      mocha.setup({ui});
    }

    mocha.reporter((runner) => {
      function send(event, data, err) {
        // console.log('sending', event)
        // console.log('sending', event, data, err)
        // console.log('sending serial', event, window.mochaTransport.serialize(data))
        try {
          window.socketIOClient.emit( "mocha/" + event, window.mochaTransport.serialize( data ), window.mochaTransport.serializeError( err ) );
        }catch (e) {
          console.log("mocha serialization error")
          console.error(e)
        }
      }
      let pass = 0;
      let fail = 0;
      let pending = 0;
      let total = 0;

      runner.on('start', function (data) {
        pass=0;
        fail=0;
        pending=0;
        total=0;
        send('start', data);
      });
      runner.on('end', function (data) {
        // console.table([
        //   {pass,fail, pending,total}
        // ])
        console.log(`%cpass:${pass} %cfail:${fail} %cpending:${pending} %ctotal:${total}`, 'color: green', 'color: red', 'color: orange', 'color: black')
        send('end', data);
      });
      runner.on('suite', function (data) {
        send('suite', data);
        if(data.title!=="") {
          console.group( data.title )
        } else {
          console.group( "tests" )
        }
      });
      runner.on('suite end', function (data) {
        console.groupEnd()
        send('suite end', data);
      });
      runner.on('test', function (data) {
        // console.group(JSON.stringify(data.titlePath()));
        total+=1
        if(data.state === 'passed') {
          console.groupCollapsed(data.title);
        } else {
          console.group( data.title );
        }
        console.timeStamp(data.title)
        send('test', data);
      });
      runner.on('test end', function (data) {
        console.groupEnd();
        send('test end', data);
      });
      runner.on('hook', function (data) {
        send('hook', data);
      });
      runner.on('hook end', function (data) {
        send('hook end', data);
      });
      runner.on('pass', function (data) {
        pass+=1
        send('pass', data);
      });
      runner.on('fail', function (data, err) {
        fail+=1;
        console.log(err);
        send('fail', data, err);
      });
      runner.on('pending', function (data) {
        pending+=1
        send('pending', data);
      });
      runner.on('start', this.handleStart.bind(this));
      runner.on('end', this.handleEnd.bind(this));
      runner.on('test', this.handleTest.bind(this));
      runner.on('test end', this.handleTestEnd.bind(this));
      runner.on('fail', this.handleFail.bind(this));
    });
  }

  get tests(){
    let tests = gatherTests(mocha.suite);
    Object.defineProperty(this, 'tests', {value: tests});
    return tests;
  }

  handleStart(){
    this.send('start', this.tests);
  }

  handleEnd(){
    this.send('end', this.tests);
  }

  handleTest(test){
    this.send('update', [{
      ...serializeTest(test),
      running: true
    }]);
  }

  handleTestEnd(test){
    this.send('update', [
      serializeTest(test)
    ]);
  }

  handleFail(runnable, err){
    runnable.$error = serializeError(err);
    let error = serializeError(err);

    if (runnable.type === 'hook') {
      error.message = `${runnable.originalTitle}: ${error.message}`;

      this.send('update', gatherTests(runnable.parent).map(test => {
        return {...test, failing: true, errors: [error]};
      }));
    }
  }

  run(){
    mocha.run();
  }
}
