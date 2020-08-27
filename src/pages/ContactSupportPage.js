import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Layout from "components/Layout";
import ContactSupportForm from "components/forms/ContactSupportForm";
import Card from "components/Card";
import gpib from "apis/gpib";

const ContactSupportPage = () => {
  const [isSent, setSent] = useState(false);
  const onSubmit = async (values, actions) => {
    try {
      console.log(values);
      await gpib.secure.post("/support", values);
      actions.setSubmitting(false);
      setSent(true);
    } catch (e) {
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };
  return (
    <Layout activeTab="Contact Support">
      <div className="container py-5">
        <Card>
          <h4>Contact Support</h4>
          <br />
          {isSent ? (
            <>
              <Alert
                variant="primary"
                children="Thank you for your enquiry. One of our team members will be in touch shortly."
              />
              <Button
                block
                variant="primary"
                children="Send new message"
                onClick={() => setSent(false)}
              />
            </>
          ) : (
            <ContactSupportForm onSubmit={onSubmit} />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ContactSupportPage;
