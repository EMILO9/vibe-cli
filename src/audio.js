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
    CREATE_REQUIRED_FOLDERS(CONFIG.REQUIRED_AUDIO_FOLDERS);
    const VALID_FILES = GET_VALID_FILES_IN_FOLDER({
      path: CONFIG.PATHS.AUDIO_INPUT,
      extensions: CONFIG.SETTINGS.VALID_EXTENSIONS,
    });
    if (!VALID_FILES.length)
      CONFIG.ERRORS.NO_VALID_FILES({
        path: CONFIG.PATHS.AUDIO_INPUT,
        extensions: CONFIG.SETTINGS.VALID_EXTENSIONS,
      });
    const VALID_JSON_FILES = GET_VALID_FILES_IN_FOLDER({
      path: CONFIG.PATHS.AUDIO_CONFIGS,
      extensions: CONFIG.SETTINGS.VALID_CONFIG_EXTENSIONS,
    });
    if (!VALID_JSON_FILES.length)
      CONFIG.ERRORS.NO_VALID_FILES({
        path: CONFIG.PATHS.AUDIO_CONFIGS,
        extensions: CONFIG.SETTINGS.VALID_CONFIG_EXTENSIONS,
      });
    ffmpeg.setFfmpegPath(CONFIG.PATHS.FFMPEG);
    ffmpeg.setFfprobePath(CONFIG.PATHS.FFPROBE);
    const SELECTED_FILE = await select({
      message: CONFIG.QUESTIONS.AUDIO_SELECT_FILE,
      choices: VALID_FILES,
    });
    const SELECTED_CONFIG_FILE = await select({
      message: CONFIG.QUESTIONS.AUDIO_SELECT_CONFIG,
      choices: VALID_JSON_FILES,
    });
    const __CONFIG__ = GET_CONFIG(
      path.join(CONFIG.PATHS.AUDIO_CONFIGS, SELECTED_CONFIG_FILE)
    );
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(CONFIG.PATHS.AUDIO_INPUT, SELECTED_FILE))
        .audioFilters(__CONFIG__)
        .on("error", reject)
        .on("end", resolve)
        .save(
          path.join(CONFIG.PATHS.AUDIO_OUTPUT, GENERATE_OUTPUT_NAME("mp3"))
        );
    });
  } catch (error) {
    ERROR_HANDLER({ path: CONFIG.PATHS.LOGS, error });
  }
})();
