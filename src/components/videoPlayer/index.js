import React from 'react';
import videojs from 'video.js';
import './myVideo.less';

export default class VideoPlayer extends React.Component {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
  componentDidMount() {
    var source = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: this.props.src,
          type: 'application/x-mpegURL',
        },
      ],
    };
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    this.player = videojs(this.videoNode, source, function onPlayerReady() {
      // that.play();
    });
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
  render() {
    return (
      <div className="videoShow1">
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-default-skin video"
            muted
            autoPlay="autoPlay"
          />
        </div>
      </div>
    );
  }
}
