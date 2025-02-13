import { generateOTP, signUp } from "../../../service/AllAuthAPI";
import { useEffect, useState } from "react";

import swal from "sweetalert";

/**
 * The Timer component is a countdown timer that starts at a given number and displays the remaining
 * time in seconds, and also provides a button to resend an OTP (One-Time Password) after the timer
 * reaches zero.
 */
const Timer = ({ email }) => {
  const [timer, setTimer] = useState(30);
  const [showResendButton, setShowResendButton] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setShowResendButton(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timer]);

  /**
   * The function `startTimer` sends an SMS with an OTP to a mobile number and handles the success and
   * error cases.
   */
  const startTimer = async () => {
    try {
      setTimer(10);
      setShowResendButton(false);
      let result = await generateOTP(email);
      console.log("generateOTP result :-", result);
      if (result.status === 200) {
        swal({
          title: "Great",
          text: "OTP sent On Your Email Please Check Your Email",
          icon: "success",
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.log("sendSms error :-", error);
      setTimer(null);
      setShowResendButton(true);
      if (error.response.status === 409) {
        swal({
          title: "Warning",
          text: `${error.response.data}`,
          icon: "warning",
          timer: 2000,
          buttons: false,
        });
      }
    }
  };

  return (
    <>
      {showResendButton ? (
        <div className="resend">
          <button onClick={startTimer} className="btn btn-primary mt-3">
            RESEND OTP
          </button>
        </div>
      ) : (
        <p className="mt-3">Resend OTP in {timer} seconds</p>
      )}
    </>
  );
};

export default Timer;
