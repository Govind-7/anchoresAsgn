import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../Navbar";

import "./index.css";

const Posts = () => {
  const [selected, setSelected] = useState("Create post");
  const [allPost, setAllposts] = useState([]);
  const [commentPost, setCommentposts] = useState([]);
  const [replyPosts, setReplyposts] = useState([]);
  const token = Cookies.get("jwt_toke");

  const allPosts = (dt) => {
    setSelected(dt);

    switch (dt) {
      case "All Posts":
        allpostsFunc();

        break;
      case "Commented Posts":
        commentedFunc();

        break;
      case "Replied Posts":
        replyiedFunc();

        break;

      default:
        break;
    }

    // console.log(jsonDt);
    // console.log(url);
  };

  const allpostsFunc = async () => {
    const url = "https://anchores.onrender.com/api/allpost";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const jsonDt = await response.json();
    setAllposts(jsonDt);
  };

  const commentedFunc = async () => {
    const url = "https://anchores.onrender.com/api/commented";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const jsonDt = await response.json();
    setCommentposts(jsonDt);
  };

  const replyiedFunc = async () => {
    const url = "https://anchores.onrender.com/api/replied";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const jsonDt = await response.json();
    setReplyposts(jsonDt);
  };
  useEffect(() => {
    allpostsFunc();
    commentedFunc();
    replyiedFunc();
  }, []);
  function containsNumber(str) {
    return /^[a-zA-Z" "]+$/.test(str);
  }

  const postFunction = async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (containsNumber(title) && containsNumber(description)) {
      const data = { title, description };
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      };
      const url = "https://anchores.onrender.com/api/postcomment";
      const response = await fetch(url, options);
      const resdata = await response.json();
      console.log(resdata);
      //   console.log(title);
      //   console.log(description);
    } else {
      alert("please enter only text ");
    }
  };

  const arr = ["All Posts", "Commented Posts", "Replied Posts", "Create post"];
  if (token === undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar />
      <div className="posts-bg">
        <div>
          {arr.map((item) => {
            const a = selected === item ? "selected-item" : "";

            return (
              <p
                className={a}
                onClick={() => {
                  allPosts(item);
                }}
              >
                {item}
              </p>
            );
          })}
        </div>
        <div>
          {selected === "All Posts" && (
            <div>
              <p>All posts ({allPost.length})</p>

              {allPost.map((item) => {
                return (
                  <div className="massage-container">
                    <h2>{item.massageTitle}</h2>
                    <p>{item.massage}</p>
                  </div>
                );
              })}
            </div>
          )}
          {selected === "Commented Posts" && (
            <div>
              <p>Commented posts({commentPost.length})</p>
            </div>
          )}
          {selected === "Replied Posts" && (
            <div>
              <p>Replied posts({replyPosts.length})</p>
            </div>
          )}

          {selected === "Create post" && (
            <form onSubmit={postFunction}>
              <p>Create post</p>
              <input
                required
                id="title"
                type="text"
                placeholder="Post title......"
              />
              <br />
              <textarea
                required
                id="description"
                cols="20"
                rows="8"
                placeholder="Description of your post....."
              ></textarea>
              <br />
              <button type="submit">Post Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
