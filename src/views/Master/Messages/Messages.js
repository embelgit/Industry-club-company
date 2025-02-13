import React, {useEffect, useState} from 'react';

import {useLocation} from 'react-router-dom';
import noMessagesImage from '../../../assets/logo-removebg.png';
import Swal from 'sweetalert2';
import {
  getAllChatDetailsWithCompanyName,
  getOldChatDetails,
  postChatStatus,
  sendChatDetails,
} from '../../../service/masterModule/Dashboard';
const Messages = () => {
  const [chats, setChats] = useState([]);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [pkChatId, setPkChatId] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [fkVendorId, setFkVendorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const {companyData, companyId, vendorId} = location.state || {};

  // const fetchAllChatDetailsWithCompanyName = async companyId => {
  //   try {
  //     setLoader(true);
  //     const result = await getAllChatDetailsWithCompanyName(companyId);
  //     console.log('Fetched Chat Company List:', result?.data);

  //     if (Array.isArray(result?.data)) {
  //       setChats(result.data);

  //       const firstChatId =
  //         result.data.length > 0 ? result.data[0].pkChatId : null;
  //       setCompanyName(
  //         result.data.length > 0 ? result.data[0].companyName : null,
  //       );

  //       setPkChatId(firstChatId);
  //     } else {
  //       console.warn('Invalid data format, resetting chats.');
  //       setChats([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Chat Company List:', error);
  //     setChats([]);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const fetchAllChatDetailsWithCompanyName = async companyId => {
    try {
      setLoader(true);
      const result = await getAllChatDetailsWithCompanyName(companyId);
      console.log('Fetched Chat Company List:', result?.data);

      if (Array.isArray(result?.data)) {
        setChats(result.data);

        const firstChatId =
          result.data.length > 0 ? result.data[0].pkChatId : null;
        setCompanyName(
          result.data.length > 0 ? result.data[0].companyName : null,
        );
        setPkChatId(firstChatId);

        // Extract fkVendorId from the first chat entry if available
        const vendorId =
          result.data.length > 0 ? result.data[0].fkVendorId : null;
        setFkVendorId(vendorId); // Set fkVendorId in the state
      } else {
        console.warn('Invalid data format, resetting chats.');
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching Chat Company List:', error);
      setChats([]);
    } finally {
      setLoader(false);
    }
  };

  const fetchOldChatDetails = async chatId => {
    try {
      setLoader(true);
      const result = await getOldChatDetails(chatId);
      console.log('Fetched Old Chat Details:', result?.data);

      if (result?.data) {
        // Set messages if chatSms is valid
        if (result.data.chatSms && Array.isArray(result.data.chatSms)) {
          setMessages(result.data.chatSms);

          // Check for chatstatus and show Swal if needed
          if (result.data.chatstatus === 'Requested') {
            Swal.fire({
              title: 'Request',
              text: 'Do you want to Accept or Reject Request?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Accept',
              cancelButtonText: 'Reject',
              reverseButtons: true,
            }).then(result => {
              if (result.isConfirmed) {
                handleChatStatusUpdate(chatId, 'Accepted');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                handleChatStatusUpdate(chatId, 'Rejected');
              }
            });
          }
        } else {
          console.warn('Invalid chatSms format, resetting messages.');
          setMessages([]);
        }
      } else {
        console.warn('Invalid result data, resetting messages.');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching Old Chat Details:', error);
      setMessages([]);
    } finally {
      setLoader(false);
    }
  };

  const handleChatStatusUpdate = async (
    pkChatId,
    chatStatus,
    status,

    index,
  ) => {
    try {
      // Make the API call with parameters in the URL
      const response = await postChatStatus(
        pkChatId,
        chatStatus,
        status,

        index,
      );

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Chat has been ${chatStatus.toLowerCase()} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error(`Error updating chat status to ${chatStatus}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to update chat status to ${chatStatus.toLowerCase()}.`,
      });
    }
  };

  const sendSms = async () => {
    const companyId = sessionStorage.getItem('_id');
    try {
      if (!message.trim()) return;

      const chatSms = [
        {
          fkCompanyId: companyId,
          fkVendorId: vendorId,
          sms: message,
        },
      ];

      await sendChatDetails(chatSms);

      setMessage('');
      if (pkChatId) fetchOldChatDetails(pkChatId);
    } catch (error) {
      console.error('Error sending chat details:', error);
    }
  };

  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem('_id');
    console.log('Company ID from sessionStorage:', storedCompanyId);
    if (storedCompanyId) {
      fetchAllChatDetailsWithCompanyName(storedCompanyId);
    }
    if (pkChatId) fetchOldChatDetails(pkChatId);
  }, []);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="d-flex vh-100">
      <div className="col-3 border-end p-3 bg-light">
        <h3>Inbox</h3>
        <ul className="list-unstyled p-0">
          {loader}
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <li
                key={index}
                className="p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center"
                style={{backgroundColor: '#ddd', cursor: 'pointer'}}
                onClick={() => {
                  setPkChatId(chat.pkChatId);
                  fetchOldChatDetails(chat.pkChatId);
                }}>
                <div>
                  <div>{chat.companyName || 'No Company Name'}</div>
                </div>
                <div style={{fontSize: '0.8rem'}}>
                  {chat.timeStamp ? formatDate(chat.timeStamp) : 'No Timestamp'}
                </div>
              </li>
            ))
          ) : (
            <p>No chats available</p>
          )}
        </ul>
      </div>

      <div className="flex-grow-1 bg-light d-flex flex-column">
        <div className="p-3 border-bottom bg-white">
          <h4>{companyData || 'Chat Details'}</h4>
        </div>

        <div className="flex-grow-1 p-3 overflow-auto bg-light position-relative">
          {/* Display the background image when there are no messages */}
          {messages.length === 0 ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{height: '100%'}}>
              <img
                src={noMessagesImage}
                alt="No messages"
                style={{maxWidth: '100%', maxHeight: '100%'}}
              />
            </div>
          ) : (
            messages.map((msg, index) => {
              const companyId = sessionStorage.getItem('_id'); // Current company ID
              const isSentByCompany = msg.fkCompanyId === companyId; // Check if the message was sent by the company
              const isReceivedFromVendor = msg.fkVendorId === companyId; // Check if the message was received from the vendor
              const isNotMatched = msg.fkVendorId === companyId; // Check if the vendor ID does not match the company ID

              console.log('isSentByCompany:', isSentByCompany);
              console.log('isReceivedFromVendor:', isReceivedFromVendor);
              console.log('isNotMatched:', isNotMatched);
              console.log('msg.fkCompanyId:', msg.fkCompanyId);
              console.log('msg.fkVendorId:', msg.fkVendorId);
              console.log('companyId:', companyId);

              // Determine the background color and text color based on the conditions
              const backgroundColor = isSentByCompany
                ? '#157347' // Green for messages sent by the company
                : isReceivedFromVendor
                  ? '#ddd' // Gray for messages received from the vendor
                  : isNotMatched
                    ? '#ddd' // Gray for messages where fkVendorId and companyId do not match
                    : '#f5f5f5'; // Default background color for cases not matching either

              const textColor =
                isSentByCompany || isReceivedFromVendor || isNotMatched
                  ? '#fff'
                  : '#000';

              return (
                <div
                  key={index}
                  className={`mb-3 d-flex justify-content-${
                    isSentByCompany ? 'end' : 'start'
                  }`}>
                  <div
                    className="max-w-70 p-3 rounded-3"
                    style={{
                      backgroundColor,
                      color: textColor,
                    }}>
                    <span>{msg.sms}</span>
                    <div className="fs-7 text-muted">
                      {formatDate(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-top bg-white d-flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="form-control me-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={sendSms}
            disabled={!message.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
