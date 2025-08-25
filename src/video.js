const CONFIG = require("./shared/config");
const { select } = require("@inquirer/prompts");
const CREATE_REQUIRED_FOLDERS = require("./shared/create_required_folders.js");
const GET_VALID_FILES_IN_FOLDER = require("./shared/get_valid_files_in_folder.js");
const ERROR_HANDLER = require("./shared/error_handler");
const GENERATE_OUTPUT_NAME = require("./shared/generate_output_name");
const GET_CONFIG = require("./shared/get_config.js");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
(async () => {
  try {
    CREATE_REQUIRED_FOLDERS(CONFIG.REQUIRED_VIDEO_FOLDERS);
    const VALID_FILES = GET_VALID_FILES_IN_FOLDER({
      path: CONFIG.PATHS.VIDEO_INPUT,
      extensions: CONFIG.SETTINGS.VALID_EXTENSIONS,
    });
    if (!VALID_FILES.length)
      CONFIG.ERRORS.NO_VALID_FILES({
        path: CONFIG.PATHS.VIDEO_INPUT,
        extensions: CONFIG.SETTINGS.VALID_EXTENSIONS,
      });
    const VALID_MEDIA_FILES = GET_VALID_FILES_IN_FOLDER({
      path: CONFIG.PATHS.VIDEO_INPUT,
      extensions: CONFIG.SETTINGS.VALID_MEDIA_EXTENSIONS,
    });
    if (!VALID_MEDIA_FILES.length)
      CONFIG.ERRORS.NO_VALID_FILES({
        path: CONFIG.PATHS.VIDEO_INPUT,
        extensions: CONFIG.SETTINGS.VALID_MEDIA_EXTENSIONS,
      });
    const VALID_JSON_FILES = GET_VALID_FILES_IN_FOLDER({
      path: CONFIG.PATHS.VIDEO_CONFIGS,
      extensions: CONFIG.SETTINGS.VALID_CONFIG_EXTENSIONS,
    });
    if (!VALID_JSON_FILES.length)
      CONFIG.ERRORS.NO_VALID_FILES({
        path: CONFIG.PATHS.VIDEO_CONFIGS,
        extensions: CONFIG.SETTINGS.VALID_CONFIG_EXTENSIONS,
      });
    ffmpeg.setFfmpegPath(CONFIG.PATHS.FFMPEG);
    ffmpeg.setFfprobePath(CONFIG.PATHS.FFPROBE);
    const SELECTED_FILE = await select({
      message: CONFIG.QUESTIONS.VIDEO_SELECT_FILE,
      choices: VALID_FILES,
    });
    const SELECTED_MEDIA_FILE = await select({
      message: CONFIG.QUESTIONS.VIDEO_SELECT_MEDIA_FILE,
      choices: VALID_MEDIA_FILES,
    });
    const SELECTED_CONFIG_FILE = await select({
      message: CONFIG.QUESTIONS.VIDEO_SELECT_CONFIG,
      choices: VALID_JSON_FILES,
    });
    const __CONFIG__ = GET_CONFIG(
      path.join(CONFIG.PATHS.VIDEO_CONFIGS, SELECTED_CONFIG_FILE)
    );
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(CONFIG.PATHS.VIDEO_INPUT, SELECTED_MEDIA_FILE))
        .loop()
        .input(path.join(CONFIG.PATHS.VIDEO_INPUT, SELECTED_FILE))
        .videoFilters(__CONFIG__)
        .on("error", reject)
        .on("end", resolve)
        .save(path.join(CONFIG.PATHS.VIDEO_OUTPUT, GENERATE_OUTPUT_NAME("mp4")));
    });
  } catch (error) {
    ERROR_HANDLER({ path: CONFIG.PATHS.LOGS, error });
  }
})();
