import React, { useEffect, useState } from "react";
import { InputNumber, Select, Space } from "antd";
import { Treatment } from "../../models/treatment";
import { Recommendation } from "../../models/recommendation";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Uuid } from "../../helpers/uuid";

const { Option } = Select;

interface TreatmentInputProps {
  value?: Recommendation;
  treatments: Treatment[];
  onChange: (recommendation: Recommendation) => void;
  onDelete: () => void;
}

const TreatmentInput = (props: TreatmentInputProps) => {
  const [repeat, setRepeat] = useState(props.value ? props.value.Repeat : 1);
  const [treatmentId, setTreatmentId] = useState(
    props.value ? props.value.TreatmentId : props.treatments[0].Id
  );

  const onTreatmentChange = (treatmentId: string) => {
    setTreatmentId(treatmentId);
  };

  const onNumberChanged = (howMany: string | number | undefined | null) => {
    if (howMany) setRepeat(+howMany);
  };

  useEffect(() => {
    props.onChange({
      Repeat: repeat,
      TreatmentId: treatmentId,
    });
  }, [repeat, treatmentId]);

  return (
    <Space direction={"vertical"} size={"large"}>
      <Space direction={"horizontal"}>
        <Select
          style={{ width: "150px" }}
          placeholder="Wyszukaj procedurę"
          defaultValue={treatmentId}
          onChange={onTreatmentChange}
        >
          {props.treatments.map((treatment) => {
            return (
              <Option key={Uuid.uuidv4()} value={treatment.Id}>
                {treatment.Name} {`(${treatment.DurationInMinutes}m)`}
              </Option>
            );
          })}
        </Select>
        <InputNumber
          required
          placeholder={"Ilość powtórzeń"}
          style={{ width: "150px" }}
          min={1}
          max={50}
          defaultValue={repeat}
          onChange={onNumberChanged}
        />
        <MinusCircleOutlined
          style={{ marginLeft: "10px" }}
          onClick={() => {
            props.onDelete();
          }}
        />
      </Space>
    </Space>
  );
};

export default TreatmentInput;
