import { useTranslation } from "react-i18next";
import style from "./footer.module.scss";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";
import Title from "../../UI/Title/Title";
import Container from "../../UI/Container/Container";
import PhoneIcon from "../../../assets/svg/phone.svg?react";
// import EmailIcon from '../../../assets/svg/email.svg?react';
import ClockIcon from "../../../assets/svg/clock.svg?react";
// import PinIcon from '../../../assets/svg/pin.svg?react';
import Text from "../../UI/Text/Text";
import Button from "../../UI/Button/Button";
import Subtitle from "../../UI/Subtitle/Subtitle";
import InfoCard from "../../InfoCard/InfoCard";
import React, { useState, useEffect } from "react";
import { useCreateFeedbackMutation } from "../../../store/services";
import { Link } from "react-router-dom";
interface FeedbackValidationError {
  status: number;
  error: string;
  messages: {
    phone?: string;
    email?: string;
    message?: string;
  };
}

function Footer() {
  const { t } = useTranslation();
  const [createFeedback] = useCreateFeedbackMutation();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorFields, setErrorFields] = useState<
    Partial<FeedbackValidationError["messages"]>
  >({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorFields({});
    setIsSuccess(false);

    try {
      const answer = await createFeedback({ email, phone, message }).unwrap();
      console.log(answer);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 400 && err.data?.messages) {
        setErrorFields(err.data.messages);
      }
    } finally {
      setIsLoading(false);
      setPhone("");
      setEmail("");
      setMessage("");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <footer className={style.footer}>
      <Container
        styles={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
        className={style.footerContainer}
      >
        <div className={style.feedback}>
          <Title styles={{ fontWeight: 600, fontSize: 30, marginBottom: 20 }}>
            {t("footer.feedback_title")}
          </Title>
          <Text
            color="black"
            styles={{ fontWeight: 400, marginBottom: 36 }}
            fontSize="18px"
          >
            {t("footer.feedback_description")}
          </Text>
          <form onSubmit={handleSubmit}>
            <div className={style.inputs}>
              <div>
                {errorFields.phone && (
                  <Text color="red">{errorFields.phone}</Text>
                )}
                <Input
                  value={phone}
                  type="number"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("footer.phone_placeholder")}
                  iconPosition="start"
                  svgStyles={{ width: 28, height: 28 }}
                  required
                  Icon={<PhoneIcon />}
                />
              </div>
              {/* <div>
                {errorFields.email && (
                  <Text color="red">{errorFields.email}</Text>
                )}
                <Input
                  value={email}
                  required
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.email_placeholder')}
                  iconPosition="start"
                  svgStyles={{ width: 28, height: 28 }}
                  Icon={<EmailIcon />}
                />
              </div> */}
            </div>
            <Subtitle
              styles={{ marginBottom: 20, fontWeight: 600 }}
              color="black"
              fontSize="18px"
            >
              {t("footer.task_description")}
            </Subtitle>
            <div className={style.textarea}>
              {errorFields.message && (
                <Text color="red">{errorFields.message}</Text>
              )}
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("footer.message_placeholder")}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("footer.sending") : t("footer.send_button")}
            </Button>
            {isSuccess && (
              <Text color="green">{t("footer.success_message")}</Text>
            )}
          </form>
        </div>
        <div className={style.info}>
          <InfoCard
            icon={
              <Link to="https://wa.me/821056155694" target="_blank">
                <PhoneIcon />
              </Link>
            }
            title={t("footer.phone_title")}
            text="+82 10-5615-5694"
          />
          <InfoCard
            icon={<ClockIcon />}
            title={t("footer.working_hours_title")}
            text="03.00 - 23.59"
          />
          {/* <InfoCard
            icon={<EmailIcon />}
            title={t('footer.email_title')}
            text={t('footer.email_text')}
          />
          <InfoCard
            icon={<PinIcon />}
            title={t('footer.address_title')}
            text={t('footer.address_text')}
          /> */}
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
