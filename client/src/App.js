import { useCallback, useEffect, useRef, useState } from "react";
import ApiClient from "./apiClient";

const api = ApiClient(!window.location.search.includes("auth=false"));

const SERVER_REFRESH_IN_SEC = 30;

/**
 * two main ideas
 * 1. two timers (current use)
 * 2. one timer + ticker counter
 */
function App() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState();
  const [serverTime, setServerTime] = useState(0);
  const [metric, setMetric] = useState();
  // discussions: should we initalise before server fetch? it lead time diff minus because it faster then server
  const [currentTime, setCurrentTime] = useState(+new Date());
  // accurate to seconds
  const timeDiff = Math.round((currentTime - serverTime) / 1000);
  const pageTimer = useRef();
  const pollTimer = useRef();

  // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
  const date = new Date(0);
  date.setSeconds(timeDiff); // specify value for SECONDS here
  var timeString = date.toISOString().substr(11, 8);

  /**
   * main function to fetch server
   */
  const fetchServer = useCallback(async () => {
    // simulate server loading
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 100);
    });
    const result = await api.getTime();
    if (result.epoch) setServerTime(result.epoch);
    const m = await api.getMetrics();
    setMetric(m);
  }, []);

  function startTimer() {
    pageTimer.current = setInterval(() => {
      setCurrentTime(+new Date());
    }, 1000);
    pollTimer.current = setInterval(() => {
      fetchServer();
    }, 1000 * SERVER_REFRESH_IN_SEC);
  }

  useEffect(() => {
    fetchServer()
      .then(startTimer)
      .catch((error) => {
        setErrorMsg(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      pageTimer.current && clearInterval(pageTimer.current);
      pollTimer.current && clearInterval(pollTimer.current);
    };
  }, []);
  if (loading)
    return (
      <center>
        <h1>Loading</h1>
      </center>
    );
  if (errorMsg)
    return (
      <center>
        <h1>{errorMsg}</h1>
        <h2>reload the page</h2>
      </center>
    );
  return (
    <div className="App">
      <div className="lhs">
        <h3>current client epoch</h3>
        <div>{currentTime}</div>
        <h3>server last fetch epoch</h3>
        <div>{serverTime}</div>
        <h3>time diff:</h3>
        <div>{timeString}</div>
      </div>
      <div className="rhs">
        <pre>{metric}</pre>
      </div>
    </div>
  );
}

export default App;
