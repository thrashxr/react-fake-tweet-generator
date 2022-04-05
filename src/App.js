/* eslint-disable prettier/prettier */
import React, { useState, createRef, useEffect } from "react";
import "./style.scss";
import {
  ReplyIcon,
  RetweetIcon,
  LikeIcon,
  ShareIcon,
  VerifiedIcon,
} from "./icons";
import { AvatarLoader } from "./loaders";
import { useScreenshot } from "use-react-screenshot";
import { language } from "./language";
function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement("CANVAS");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || "image/png");
    callback.call(this, dataURL);
    // Clean up
    canvas = null;
  };
  img.src = url;
}

const tweetFormat = (tweet) => {
  tweet = tweet
    .replace(/@([\w]+)/g, "<span>@$1</span>")
    .replace(/#([\wşçöğüıİ]+)/gi, "<span>#$1</span>")
    .replace(/(https?:\/\/[\w\.\/]+)/, "<span>$1</span>")
    .replace(/\n/g, "<br />");
  return tweet;
};

const formatNumber = (number) => {
  if (!number) {
    number = 0;
  }
  if (number < 1000) {
    return number;
  }
  number /= 1000;
  number = String(number).split(".");

  return (
    number[0] + (number[1] > 100 ? "," + number[1].slice(0, 1) + " B" : " B")
  );
};

export default function App() {
  const tweetRef = createRef(null);
  const downloadRef = createRef();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isVerified, setIsVerified] = useState(0);
  const [tweet, setTweet] = useState();
  const [avatar, setAvatar] = useState();
  const [retweets, setRetweets] = useState(0);
  const [quoteTweets, setQuoteTweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [lang, setLang] = useState("tr");
  const [image, takeScreenshot] = useScreenshot();
  const [langText, setLangText] = useState();
  const getImage = () => takeScreenshot(tweetRef.current);

  useEffect(() => {
    setLangText(language[lang]);
  }, [lang]);

  useEffect(() => {
    if (image) {
      downloadRef.current.click();
    }
  }, [image]);

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setAvatar(this.result);
    });
    reader.readAsDataURL(file);
  };

  const fetchTwitterInfo = () => {
    fetch(
      `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`
    )
      .then((res) => res.json())
      .then((data) => {
        const twitter = data[0];
        console.log(twitter);

        convertImgToBase64(
          twitter.profile_image_url_https,
          function (base64Image) {
            setAvatar(base64Image);
          }
        );

        setName(twitter.name);
        setUsername(twitter.screen_name);
        setTweet(twitter.status.text);
        setRetweets(twitter.status.retweet_count);
        setLikes(twitter.status.favorite_count);
      });
  };
  const [textAreaCount, settextAreaCount] = React.useState(0);

  const recalculate = (e) => {
    let textAreaCount = e.target.value.length;
    console.log(textAreaCount);
  };

  {
    /*
  TODO
  fix colors
  fix verified select
  fix settings position
  add navbar
*/
  }
  return (
    <>
      <div class="dark:bg-slate-900 dark:text-white max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg z-10">
        <div class="grid  gap-8 grid-cols-1 ">
          <div class="flex flex-col ">
            <div class="flex flex-col sm:flex-row items-center">
              <h2 class="font-semibold text-lg mr-auto">
                {langText?.settings}
              </h2>
              <div class="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
            </div>
            <div class="mt-5">
              <div class="form">
                <div class="md:space-y-2 mb-3">
                  <div class="flex items-center py-6">
                    <label class="cursor-pointer ">
                      <span class="focus:outline-none text-sm py-2 px-4 rounded-full bg-green-400 hover:bg-green-500 hover:shadow-lg">
                        Avatar
                      </span>
                      <input
                        type="file"
                        class="hidden"
                        onChange={avatarHandle}
                      />
                    </label>
                  </div>
                </div>
                <div class="md:flex flex-row md:space-x-4 w-full text-xs">
                  <div class="mb-3 space-y-2 w-full text-xs">
                    <label class="font-semibold text-gray-600 py-2">
                      {langText?.name}
                      <abbr title="required">*</abbr>
                    </label>
                    <input
                      placeholder={langText?.name}
                      class="text-gray-600 appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
                      required="required"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div class="mb-3 space-y-2 w-full text-xs">
                    <label class="font-semibold text-gray-600 py-2">
                      {langText?.username} <abbr title="required">*</abbr>
                    </label>
                    <input
                      placeholder={langText?.username}
                      class="text-gray-600 appearance-none block w-full bg-grey-lighter border border-grey-lighter rounded-lg h-10 px-4"
                      required="required"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div class="md:flex md:flex-row md:space-x-4 w-full text-xs">
                  <div class="w-full flex flex-col mb-3">
                    <label class="font-semibold text-gray-600 py-2">
                      Retweet
                    </label>
                    <input
                      placeholder="Retweet"
                      class="text-gray-600 appearance-none block w-full bg-grey-lighter border border-grey-lighter rounded-lg h-10 px-4"
                      type="number"
                      value={retweets}
                      onChange={(e) => setRetweets(e.target.value)}
                    />
                  </div>
                  <div class="w-full flex flex-col mb-3">
                    <label class="font-semibold text-gray-600 py-2">
                      {langText?.quoteTweets}
                      <abbr title="required">*</abbr>
                    </label>
                    <input
                      placeholder={langText?.quoteTweets}
                      class="text-gray-600 appearance-none block w-full bg-grey-lighter border border-grey-lighter rounded-lg h-10 px-4"
                      type="number"
                      value={quoteTweets}
                      onChange={(e) => setQuoteTweets(e.target.value)}
                    />
                  </div>
                  <div class="w-full flex flex-col mb-3">
                    <label class="font-semibold text-gray-600 py-2">
                      {langText?.likes}
                      <abbr title="required">*</abbr>
                    </label>
                    <input
                      placeholder={langText?.likes}
                      class="text-gray-600 appearance-none block w-full border border-grey-lighter rounded-lg h-10 px-4"
                      type="number"
                      value={likes}
                      onChange={(e) => setLikes(e.target.value)}
                    />
                  </div>
                </div>
                <div class="flex-auto w-full mb-1 text-xs space-y-2">
                  <label class="font-semibold text-gray-600 py-2">Tweet</label>
                  <textarea
                    name="message"
                    class="text-gray-600 w-full min-h-[100px] max-h-[300px] h-28 appearance-none block w-full bg-grey-lighter border border-grey-lighter rounded-lg py-4 px-4 text-black "
                    placeholder="Tweet"
                    value={tweet}
                    maxLength="50"
                    onChange={(e) => {
                      setTweet(e.target.value);
                      settextAreaCount(e.target.value.length);
                    }}
                  ></textarea>
                  <p class="text-xs text-gray-400 text-left my-3">
                    {langText?.wLimit} <b>{textAreaCount}/50</b>
                  </p>
                </div>

                <div class="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
                  <button
                    class="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full hover:shadow-lg hover:bg-green-500"
                    onClick={getImage}
                  >
                    {langText?.download}
                  </button>
                  {image && (
                    <a ref={downloadRef} href={image} download="tweet.png">
                      {langText?.download}
                    </a>
                  )}
                </div>
                <div
                  onChange={(e) => setIsVerified(e.target.value)}
                  className="px-0"
                >
                  <label class="font-semibold text-gray-600 py-2">
                    {langText?.isVerified}
                  </label>
                  <br />
                  <input type="radio" value="1" name="gender" />{" "}
                  {langText?.show} <br />
                  <input type="radio" value="0" name="gender" />{" "}
                  {langText?.hide}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tweet-container ">
        <div className="app-language">
          <span
            onClick={() => setLang("tr")}
            className={lang === "tr" && "active"}
          >
            Türkçe
          </span>
          <span
            onClick={() => setLang("en")}
            className={lang === "en" && "active"}
          >
            English
          </span>
        </div>
        <div className="fetch-info">
          <input
            type="text"
            value={username}
            placeholder={langText?.username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent text-white p-2 text-sm"
          />
          <button
            onClick={fetchTwitterInfo}
            className="w-25 h-10 rounded-sm text-base text-white bg-blue-500 cursor-pointer"
          >
            {langText?.fetchInfo}
          </button>
        </div>
        {langText?.download}
        <div
          className="tweet dark:bg-slate-900 dark:text-white rounded-lg p-6 ml-4 sticky top-0 z-10"
          ref={tweetRef}
        >
          <div className="tweet-author">
            {(avatar && <img src={avatar} />) || <AvatarLoader />}
            <div>
              <div className="name">
                <span>{name || langText?.name}</span>
                {isVerified == 1 && <VerifiedIcon width="19" height="19" />}
              </div>
              <div className="username">@{username || langText?.username}</div>
            </div>
          </div>
          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html: (tweet && tweetFormat(tweet)) || langText?.example,
              }}
              className="break-all"
            />
          </div>
          <div className="tweet-stats">
            <span>
              <b>{formatNumber(retweets)}</b> Retweet
            </span>
            <span>
              <b>{formatNumber(quoteTweets)}</b> {langText?.quoteTweets}
            </span>
            <span>
              <b>{formatNumber(likes)}</b> {langText?.likes}
            </span>
          </div>
    <div className="tweet-actions">
            <span>
              <ReplyIcon />
            </span>
            <span>
              <RetweetIcon />
            </span>
            <span>
              <LikeIcon />
            </span>
            <span>
              <ShareIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
