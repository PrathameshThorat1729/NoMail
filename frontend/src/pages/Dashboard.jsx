import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { format } from "timeago.js";
import * as Database from "../utils/Database";
import { Markup } from "interweave";
import {
  VscChevronRight,
  VscAdd,
  VscSignOut,
  VscCopy,
  VscArchive,
  VscMail,
  VscTrash,
} from "react-icons/vsc";
import "../css/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  let [activeMailIndex, setActiveMailIndex] = useState(-1);
  let [activeMailBody, setActiveMailBody] = useState("");
  let [emails, setEmails] = useState([]);
  let [activeMailList, setActiveMailList] = useState([]);

  const controller = new AbortController();
  const signal = controller.signal;

  function createEmail() {
    let name = prompt("Enter Name : ");
    name = name.slice(0, (name.length < 13) ? name.length : 12);
    const mailjs = new Mailjs();
    mailjs.createOneAccount().then(async (acc) => {
      let res = await Database.createEmail(
        { name, email: acc.data.username, token: mailjs.token },
        signal
      );
      if (res.status)
        setEmails((e) => [...e, { name, email: acc.data.username, mailjs }]);
    });
  }

  useEffect(() => {
    if (!localStorage.getItem("loginToken")) {
      navigate("/login");
      return () => {};
    }

    (async function () {
      const response = await Database.getEmails();
      setEmails(
        (e) =>
          (response.status &&
            response.data.map((e) => {
              const mailjs = new Mailjs();
              mailjs.loginWithToken(e.token);
              return { name: e.name, email: e.email, mailjs };
            })) ||
          []
      );
    })();

    setActiveMailIndex(0);
  }, []);

  let activeEmail = emails[activeMailIndex];

  useEffect(() => {
    if (activeEmail)
      activeEmail.mailjs.getMessages().then((e) => setActiveMailList(e.data));
  }, [emails, activeMailIndex]);
  return (
    <>
      <div className="dashboard-container">
        <div className="sidebar">
          <span className="logo-box flex-center">
            <img src="/logo.png" alt="NoMail Logo" width={80} />
            <span>NoMail</span>
          </span>
          <button className="create-email btn" onClick={createEmail}>
            <VscAdd /> &nbsp;&nbsp;Create New Email
          </button>
          <div className="sidebar-items-box">
            {emails.map((e, i) => (
              <div
                key={i}
                className={"email-name " + (i == activeMailIndex && "active")}
                onClick={() => {
                  setActiveMailIndex(i);
                  setActiveMailBody();
                }}
              >
                <VscChevronRight /> &nbsp;{e.name}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("loginToken");
              navigate("/login");
            }}
            className="logout btn"
          >
            <VscSignOut /> &nbsp;&nbsp;Logout
          </button>
        </div>
        {activeEmail && (
          <div className="temp-email-box">
            {activeEmail.email}
            <div className="flex-center">
              <button
                onClick={async () => {

                  let response = await Database.deleteEmail(activeEmail);
                  
                  if (response.status) {
                    activeEmail.mailjs.deleteMe();
                    
                    setEmails((e) => e.filter(e => {
                      if(e.email == activeEmail.email) return false;
                      return true;
                    }));
                    setActiveMailIndex(e => (e == 0) ? 0 : e-1);
                  }
                }}
                className="del-email btn"
              >
                <VscTrash />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeEmail.email);
                }}
                className="cpy-email btn"
              >
                <VscCopy />
              </button>
            </div>
          </div>
        )}
        <div className="emails-list">
          {activeMailList && activeMailList.length > 0 ? (
            activeMailList.map((e, i) => {
              return (
                <div
                  onClick={() => {
                    activeEmail.mailjs.getMessage(e.id).then((e) => {
                      setActiveMailBody({
                        ...e.data,
                        html: e.data.html.join("\n"),
                      });
                    });
                    activeEmail.mailjs.setMessageSeen(e.id, true);
                  }}
                  key={i}
                  className={"emails-list-box " + (!e.seen && "unread ")}
                >
                  <div className="timeago">{format(new Date(e.createdAt))}</div>
                  <div className="name">{e.from.name}</div>
                  <div className="subject">{e.subject || "__________"}</div>
                </div>
              );
            })
          ) : (
            <div className="nothing-here flex-center">
              <VscArchive style={{ fontSize: "50px", color: "grey" }} />
            </div>
          )}
        </div>
        <div className="emails-box">
          {activeMailBody ? (
            <>
              <div className="header">
                <div className="timeago">
                  {new Date(activeMailBody.createdAt).toLocaleDateString() +
                    " | " +
                    new Date(activeMailBody.createdAt).toLocaleTimeString()}
                </div>
                <div className="name">{activeMailBody.from.name}</div>
                <div className="subject">
                  {activeMailBody.subject || "__________"}
                </div>
                <div className="email">{activeMailBody.from.address}</div>
              </div>
              <div className="body">
                <Markup content={activeMailBody.html} />
              </div>
            </>
          ) : (
            <div className="nothing-here flex-center">
              <VscMail style={{ fontSize: "50px", color: "grey" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
