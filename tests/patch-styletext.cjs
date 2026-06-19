const util = require('node:util');
if (util.styleText) {
  const originalStyleText = util.styleText;
  util.styleText = function (format, text) {
    if (Array.isArray(format)) {
      try {
        // Apply formats sequentially
        return format.reduce((acc, f) => originalStyleText(f, acc), text);
      } catch (e) {
        return text;
      }
    }
    try {
      return originalStyleText(format, text);
    } catch (e) {
      return text;
    }
  };
}
