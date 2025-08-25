const _path = require("path");
module.exports = {
  SETTINGS: {
    SHARED_FOLDERS: ["logs", "bin"],
    AUDIO_FOLDERS: [".audio/input", ".audio/output", ".audio/configs"],
    VIDEO_FOLDERS: [".video/input", ".video/output", ".video/configs"],
    VALID_EXTENSIONS: ["mp3", "wav", "flac", "aac", "ogg"],
    VALID_CONFIG_EXTENSIONS: ["cfg"],
    VALID_MEDIA_EXTENSIONS: ["jpg", "png"],
  },
  QUESTIONS: {
    AUDIO_SELECT_FILE: "Select your audio file:",
    AUDIO_SELECT_CONFIG: "Select your audio config file:",
    VIDEO_SELECT_FILE: "Select your video file:",
    VIDEO_SELECT_CONFIG: "Select your video config file:",
    VIDEO_SELECT_MEDIA_FILE: "Select you image file:"
  },
  ERRORS: {
    NO_VALID_FILES({ path, extensions }) {
      throw new Error(
        `No valid files found in "${_path.relative(
          process.cwd(),
          path
        )}". Expected extensions: ${extensions.join(", ")}.`
      );
    },
  },
  PATHS: {
    DIRECTORY: process.cwd(),
    get AUDIO_INPUT() {
      return _path.join(this.DIRECTORY, ".audio/input");
    },
    get VIDEO_INPUT() {
      return _path.join(this.DIRECTORY, ".video/input");
    },
    get LOGS() {
      return _path.join(this.DIRECTORY, "logs");
    },
    get FFMPEG() {
      return _path.join(this.DIRECTORY, "bin/ffmpeg.exe");
    },
    get FFPROBE() {
      return _path.join(this.DIRECTORY, "bin/ffprobe.exe");
    },
    get AUDIO_OUTPUT() {
      return _path.join(this.DIRECTORY, ".audio/output");
    },
    get VIDEO_OUTPUT() {
      return _path.join(this.DIRECTORY, ".video/output");
    },
    get AUDIO_CONFIGS() {
      return _path.join(this.DIRECTORY, ".audio/configs");
    },
    get VIDEO_CONFIGS() {
      return _path.join(this.DIRECTORY, ".video/configs");
    },
  },
  get REQUIRED_AUDIO_FOLDERS() {
    return [
      ...this.SETTINGS.AUDIO_FOLDERS,
      ...this.SETTINGS.SHARED_FOLDERS,
    ].map((p) => _path.join(this.PATHS.DIRECTORY, p));
  },
  get REQUIRED_VIDEO_FOLDERS() {
    return [
      ...this.SETTINGS.VIDEO_FOLDERS,
      ...this.SETTINGS.SHARED_FOLDERS,
    ].map((p) => _path.join(this.PATHS.DIRECTORY, p));
  },
};
