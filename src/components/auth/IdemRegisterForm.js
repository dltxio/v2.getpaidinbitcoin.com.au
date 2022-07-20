import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { isEmail } from "validator";
import Input from "components/forms/Input";
import SubmitSpinnerButton from "components/forms/SubmitSpinnerButton";
import gpib from "apis/gpib";
import Card from "components/Card";
import ErrorMessage from "components/ErrorMessage";
import { AuthContext } from "components/auth/Auth";
import { useHistory } from "react-router-dom";
import "./RegisterForm.scss";
import IdemQRCode from "components/IdemQRCode";

const defaultValues = {
  email: ""
};

const parseSubmitValues = (v) => ({
  email: v.email
});

const validate = ({ email }) => {
  const requiredMsg = "This field is required";
  const errors = {};

  // Required fields
  if (!email) errors.email = requiredMsg;

  // Formatting
  if (!isEmail(email)) errors.email = "Please enter a valid email";

  return errors;
};

const IDEMRegisterForm = ({
  initialValues: _iv,
  lockReferralCode,
  enterprise,
  logo
}) => {
  const initialValues = { ...defaultValues, ..._iv };
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const onSubmit = async (values, actions) => {
    try {
      const parsedValues = parseSubmitValues(values);
      await gpib.open.post("https://proxy.idem.com.au/", parsedValues);
      login({
        username: parsedValues.email
      });
      history.push("/");
    } catch (e) {
      console.log(e);
      actions.setErrors({ hidden: e });
      actions.setSubmitting(false);
    }
  };

  return (
    <Card style={{ width: 500, height: 410 }}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {logo && (
              <div className="mb-5 mt-2 flex justify-content-center">
                <img
                  src={`${process.env.REACT_APP_API_URL}/Logos/${logo}`}
                  alt="logo"
                  className="logo-image"
                />
              </div>
            )}
            <IdemQRCode />
            <Input
              className="mt-3 w-100"
              name="email"
              placeholder="Please register with your IDEM email"
              disabled={initialValues?.email}
            />
            <ErrorMessage error={errors.hidden} />
            <SubmitSpinnerButton
              submitText="Join with IDEM"
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default IDEMRegisterForm;
