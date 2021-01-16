import React, { useEffect, useState } from "react";
import { TrackerBtnContainer, TrackerContainer } from "./styled";
import {
  CarryOutOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useSchedulingResult } from "../../store/schedulingResult";
import { RecommendationSolution } from "../../models/RecommendationSolution";

const { Title } = Typography;

export const PropositionsTracker = () => {
  const [total, setTotal] = useState(10);
  const [selected, setSelected] = useState(2);

  const [
    { acceptedBlocks, schedulingResult },
    { acceptAll, removeAll, clear },
  ] = useSchedulingResult();

  useEffect(() => {
    if (!schedulingResult) return;

    setTotal(schedulingResult.Solutions.length);

    let selected = 0;
    let selectedSolution = new Set<RecommendationSolution>();

    for (let i = 0; i < schedulingResult.Solutions.length; i++) {
      const solution = schedulingResult.Solutions[i];
      const ids = solution.BlockIds;

      for (let j = 0; j < ids.length; j++) {
        if (acceptedBlocks.has(ids[j]) && !selectedSolution.has(solution)) {
          selectedSolution.add(solution);
          selected++;
        }
      }
    }
    setSelected(selected);
  }, [schedulingResult, acceptedBlocks]);

  const confirm = async () => {};

  return (
    <TrackerContainer>
      <Title style={{ color: "inherit" }} level={4}>
        Zaznaczono {selected} z {total}
      </Title>
      <Button
        onClick={() => {}}
        type={"text"}
        style={{ right: 5, top: 5, position: "absolute" }}
        icon={<CloseOutlined />}
      />
      <TrackerBtnContainer>
        <Button
          type={"dashed"}
          onClick={() => acceptAll()}
          style={{ marginRight: "1rem", background: "transparent" }}
          icon={<CheckOutlined />}
        >
          Zaznacz wszystkie
        </Button>
        <Button
          onClick={() => removeAll()}
          type={"dashed"}
          style={{ background: "transparent" }}
          icon={<CloseOutlined />}
        >
          Odznacz wszystkie
        </Button>
      </TrackerBtnContainer>
      <TrackerBtnContainer>
        <Button
          onClick={() => confirm()}
          style={{ background: "transparent", marginTop: "2rem" }}
          icon={<CarryOutOutlined />}
        >
          Zatwierdź
        </Button>
        <Button
          onClick={() => clear()}
          style={{ background: "transparent", marginTop: "2rem" }}
          icon={<CarryOutOutlined />}
        >
          Anuluj
        </Button>
      </TrackerBtnContainer>
    </TrackerContainer>
  );
};
