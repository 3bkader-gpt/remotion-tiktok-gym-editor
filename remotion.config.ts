// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// 🎬 Maximum Master Quality Settings
Config.setCrf(14); // Lowest CRF = Highest visual bitrate and preservation of film details
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
