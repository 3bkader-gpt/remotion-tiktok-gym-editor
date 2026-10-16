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

// ⚡ Stability & Memory Management for 4K / Heavy HEVC Phone Footage
Config.setConcurrency(2); // Use 2 parallel workers to prevent 4K compositor memory exhaustion
Config.setOffthreadVideoCacheSizeInBytes(1024 * 1024 * 1024 * 2); // 2GB OffthreadVideo compositor cache
Config.setTimeoutInMilliseconds(120000); // 120s timeout per frame for heavy 4K decoding

