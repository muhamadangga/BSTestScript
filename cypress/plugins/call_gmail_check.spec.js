// ...
describe("New user registration", async function() {
    it("Register Form: Email is delievered", function() {
      //const test_id = new Date().getTime();+${test_id}
      const incoming_mailbox = `tapanafax@gmail.com`;
      cy
        .task("gmail:check", {
          from: "no-reply@freshjet.nl",
          to: incoming_mailbox,
          subject: "Login"
        })
        .then(email => {
          assert.isNotNull(email, `Email was not found`);
        });
    });
  });