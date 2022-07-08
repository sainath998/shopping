import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import me from './me.jpg'


const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/sai_nath_reddy_863";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={me}
              alt="Founder"
            />
            <Typography>Sainath reddy</Typography>
            <button onClick={visitInstagram} color="primary">
              Visit Instagram
            </button>
            <span>
              This is a sample wesbite 
            </span>
          </div>
          <div className="aboutSectionContainer2">
            {/* <Typography component="h2">Our Brands</Typography> */}
            <a
              href="https://www.youtube.com/channel/UCO7afj9AUo0zV69pqEYhcjw"
              target="blank"
            >
              {/* <YouTubeIcon className="youtubeSvgIcon" /> */}
            </a>

            <a href="https://instagram.com/meabhisingh" target="blank">
              {/* <InstagramIcon className="instagramSvgIcon" /> */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
