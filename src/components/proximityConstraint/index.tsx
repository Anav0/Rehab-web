import React from "react";
import { Space, Select } from "antd";
import { Uuid } from "../../helpers";
import mockTreatments from "../../mock/treatments";
import { Treatment } from "../../models/treatment";

const { Option } = Select;

export interface ProximityConstraintState {
  sign: number;
  offset: number;
  treatment: Treatment;
  treatmentIndex: number;
}

interface ProximityConstraintProps {
  onValueChanged: (info?: ProximityConstraintState) => void;
}

export class ProximityConstraint extends React.Component<
  ProximityConstraintProps,
  ProximityConstraintState
> {
  constructor(props: ProximityConstraintProps) {
    super(props);
    this.state = {
      offset: 60,
      sign: -1,
      treatment: mockTreatments[0],
      treatmentIndex: 0,
    };
  }

  componentWillUnmount() {
    this.props.onValueChanged(undefined);
  }

  render() {
    const timeOptions = [
      { text: "1h", value: 60 },
      { text: "2h", value: 60 * 2 },
      { text: "3h", value: 60 * 3 },
      { text: "4h", value: 60 * 4 },
    ];
    const commonSelectStyle = { minWidth: "100px" };

    return (
      <Space>
        Wizyta ma się odbyć{" "}
        <Select
          value={this.state.offset}
          onChange={(event: any) => {
            this.setState(
              (state, props) => ({
                offset: event,
              }),
              () => {
                this.props.onValueChanged(this.state);
              }
            );
          }}
          style={commonSelectStyle}
        >
          {timeOptions.map((option) => (
            <Option key={Uuid.uuidv4()} value={option.value}>
              {option.text}
            </Option>
          ))}
        </Select>
        <Select
          value={this.state.sign}
          onChange={(event: any) =>
            this.setState(
              (state, props) => ({
                sign: event,
              }),
              () => this.props.onValueChanged(this.state)
            )
          }
          style={commonSelectStyle}
        >
          <Option value={1}>przed</Option>
          <Option value={-1}>po</Option>
        </Select>
        <Select
          value={this.state.treatmentIndex}
          onChange={(event: any) => {
            this.setState(
              (state, props) => ({
                treatment: mockTreatments[event],
                treatmentIndex: event,
              }),
              () => this.props.onValueChanged(this.state)
            );
          }}
          style={commonSelectStyle}
        >
          {mockTreatments.map((treatment: Treatment, i) => {
            return (
              <Option value={i} key={Uuid.uuidv4()}>
                {treatment.Name}
              </Option>
            );
          })}
        </Select>
      </Space>
    );
  }
}
