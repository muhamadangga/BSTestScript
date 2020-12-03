on("task", {
    "gmail:check": async args => {
      const { from, to, subject } = args;
      // Find an email which has the words in 'subject', sent from 'from' email address, to 'to' email address.
    }
  });