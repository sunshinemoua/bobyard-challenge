import React, { useEffect, useState } from "react";
import "./App.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { LuThumbsUp } from "react-icons/lu";
import api from "./api";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState([]);

  const postSchema = yup.object({
    text: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(postSchema),
  });

  // Call GET comments
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/comments");
      setPosts(res.data);
      return res.data;
    };
    fetchData();
  }, []);

  // delete comment
  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/comments/${id}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Cannot delete comment", error);
    }
  };

  // edit comment
  const handleEdit = (post) => {
    setEditPost(post);
  };

  // update comment
  const updateComment = async () => {
    if (editPost) {
      const res = await api.post(`/comments/${editPost.id}`, {
        text: editPost.text,
      });
      setPosts(res.data);
      setEditPost(null);
    }
  };

  // client side -- update comment
  const updateText = (event) => {
    const text = event.target.value;
    setEditPost({
      ...editPost,
      text,
    });
  };

  // create comment
  const onSubmit = async (data) => {
    const id = posts?.[0]?.id + 1;
    const obj = {
      ...data,
      id,
      author: "admin",
      likes: 0,
      date: new Date(),
    };

    const res = await api.post("/comments", obj);
    setPosts(res.data);
    reset();
  };

  return (
    <div className="post-form-wrapper">
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-wrapper">
            <textarea
              {...register("text")}
              placeholder="Say something..."
              rows={8}
            />
            {errors.post && <span>This is required</span>}

            <input type="submit" />
          </div>
        </form>
        {posts && posts.length
          ? posts?.map((post) => {
              const date = moment(post.date).format("llll ");
              return (
                <div key={post.id} className="post-outer-div">
                  <div className="author-wrapper">
                    <div className="name">{post.author}</div>
                    <div>{date}</div>
                  </div>
                  {post?.image !== "" ? (
                    <div className="img">
                      <img src={post?.image} alt="img" width="50%" />
                    </div>
                  ) : null}

                  {post.id === editPost?.id ? (
                    <div className="edit-wrapper">
                      <textarea onChange={updateText}>{post.text}</textarea>
                      <button onClick={updateComment}>Save</button>
                    </div>
                  ) : (
                    <div className="text"> {post.text}</div>
                  )}

                  <div className="interactions">
                    <div className="likes">
                      <LuThumbsUp /> {post.likes}
                    </div>
                    {post.id !== editPost?.id ? (
                      <div className="edit-delete">
                        <button onClick={() => handleEdit(post)}>Edit</button>

                        <button onClick={() => handleDelete(post.id)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default App;
