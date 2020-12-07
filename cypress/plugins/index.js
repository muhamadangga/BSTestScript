// ...
const path = require("path");
const gmail=  require("gmail-tester");
const clipboardy=  require("clipboardy");

console.log(path.resolve(__dirname, "credentials.json"));

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // ...

  on("task", {
    "gmail:check": async args => {
      const { from, to, subject } = args;
      const email = await gmail.check_inbox(
        path.resolve(__dirname, "credentials-"+to+".json"), // credentials.json is inside plugins/ directory.
        path.resolve(__dirname, "gmail_token-"+to+".json"), // gmail_token.json is inside plugins/ directory.
        {
        subject, //: "Login", // We are looking for 'Activate Your Account' in the subject of the message.
        from, //: "no-reply@freshjet.nl", // We are looking for a sender header which is 'no-reply@domain.com'.
        to, //: "tapanafax@gmail.com", // Which inbox to poll. credentials.json should contain the credentials to it.
        wait_time_sec: 10, // Poll interval (in seconds).
        max_wait_time_sec: 30, // Maximum poll time (in seconds), after which we'll giveup.
        include_body: true
        }
        // subject:"Login",
        // "no-reply@freshjet.nl",
        // "tapanafax@gmail.com",
        // 10,                                          // Poll interval (in seconds)
        // 30                                           // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
      );
    //   if (email) {
    //       console.log("Email was found!");
    //   } else {
    //     console.log("Email was not found!");
    //   }
      return email;
    },

    getClipboard () {
      return clipboardy.readSync();
  }

  });
};
