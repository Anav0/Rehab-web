import React, { useState } from "react";
import { Button, Form, notification, Space, Typography } from "antd";
import { TimeBlock } from "../../models/timeBlock";
import { TimeSection } from "./time-section";
import { ProcedureSection } from "./procedure-section";
import { PatientSection } from "./patient-section";
import { AppointmentFormData } from "../../models/appointmentFormData";
import { UnableSection } from "./unable-section";
import { useSelectedDate } from "../../store/selectedDate";
import { NewAppointmentForm } from "./styled";
import { schedule } from "./oprations";
import { usePatients } from "../../store/patients";
import { useProposition } from "../../store/proposition";

const { Title } = Typography;

const AppointmentForm = (props: any) => {
  const [, { updateSelectedDate }] = useSelectedDate();
  const [, { changeSelectedPatient }] = usePatients();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [_, { setProposition }] = useProposition();

  const send = async (formData: AppointmentFormData) => {
    setIsProcessing(true);
    try {
      changeSelectedPatient(formData.patient);
      const data = await schedule(formData);
      setProposition(data);
      //TODO: display proposition
      //   notification.success({
      //     message: "Sukces",
      //     onClick: () => {
      //       updateSelectedDate(blocks[0].StartDate);
      //     },
      //     description: (
      //       <Space direction="vertical">
      //         <span>
      //           {new Date(blocks[0].StartDate).toLocaleString("pl", {
      //             day: "2-digit",
      //             month: "2-digit",
      //             year: "numeric",
      //             weekday: "long",
      //             hour: "2-digit",
      //             minute: "2-digit",
      //           })}
      //         </span>
      //       </Space>
      //     ),
      //   });
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      let errMsg =
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message;

      notification.open({
        message: "Error",
        description: errMsg,
      });
      setIsProcessing(false);
    }
  };

  return (
    <NewAppointmentForm onFinish={(values: any) => send(values)}>
      <Title level={3}>Formularz zabiegowy</Title>
      <PatientSection />
      <UnableSection />
      <TimeSection />
      <ProcedureSection />
      <Form.Item>
        <Button loading={isProcessing} type="primary" htmlType="submit">
          Wyślij
        </Button>
      </Form.Item>
    </NewAppointmentForm>
  );
};

export default AppointmentForm;
