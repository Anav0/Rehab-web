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
import { api } from "../../api";
import { Checkbox } from "antd";
import { TimeBlock } from "../../models/timeBlock";

const { Title } = Typography;

export const PropositionsTracker = () => {
  const [blocks] = useState<Map<string, TimeBlock[]>>(new Map());
  const [selected, setSelected] = useState<number>(0);
  const [checkBoxOptions, setCheckBoxOptions] = useState<
    { ids: string[]; checked: boolean; label: string; value: number }[]
  >([]);

  const [
    { acceptedBlocks, schedulingResult },
    { acceptAll, removeAll, acceptBlocksWithIds, removeBlocksWithIds, clear },
  ] = useSchedulingResult();

  const getTimeBlocks = async (ids: string[]) => {
    try {
      const { data: timeBlocks } = await api.blocks.byIds(ids);
      return timeBlocks;
    } catch (err) {
      console.error(err);
      //TODO: add error handling
    }
    return [];
  };

  const getLabel = (blocks: TimeBlock[]) => {
    let label = ``;
    let lang = "de";
    blocks.sort((a, b) => (a.StartDate < b.StartDate ? -1 : 1));

    let prevBlock: TimeBlock | undefined = undefined;

    for (let block of blocks) {
      let date = new Date(block.StartDate).toLocaleDateString(lang, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      let prevDate = !prevBlock
        ? ""
        : new Date(prevBlock.StartDate).toLocaleDateString(lang, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

      if (date === prevDate)
        label += `, ${new Date(block.StartDate).toLocaleTimeString(lang, {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      else
        label += ` ${new Date(block.StartDate).toLocaleDateString(lang, {
          year: "numeric",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}`.replace(",", ": ");
      prevBlock = block;
    }

    return label;
  };

  useEffect(() => {
    if (!schedulingResult) return;
    console.log("propositon-tracker called");
    console.log(acceptedBlocks);

    let selected = 0;
    let selectedSolutions = new Set<RecommendationSolution>();
    let checkBoxOptionsTmp: {
      checked: boolean;
      label: string;
      value: number;
      ids: string[];
    }[] = [];

    const fetch = async () => {
      for (let i = 0; i < schedulingResult.Solutions.length; i++) {
        const solution = schedulingResult.Solutions[i];
        const ids = solution.BlockIds;

        //Check if blocks where fetchd before.
        let tmpBlocks: TimeBlock[] = [];
        if (!blocks.has(ids[0])) {
          tmpBlocks = await getTimeBlocks(ids);
          blocks.set(ids[0], tmpBlocks);
        } else tmpBlocks = blocks.get(ids[0]) as TimeBlock[];

        let checkBoxModel = {
          label: getLabel(tmpBlocks),
          value: i,
          checked: false,
          ids,
        };

        for (let j = 0; j < ids.length; j++) {
          if (acceptedBlocks.has(ids[j]) && !selectedSolutions.has(solution)) {
            checkBoxModel.checked = true;
            selectedSolutions.add(solution);
            selected++;
          }
        }

        checkBoxOptionsTmp.push(checkBoxModel);
      }
      setCheckBoxOptions(checkBoxOptionsTmp);
    };
    // eslint-disable-next-line no-loop-func
    fetch().then(() => setSelected(selected));
  }, [acceptedBlocks, blocks, schedulingResult]);

  const confirm = async () => {
    let filteredSchedulingResult = schedulingResult;

    // for (let id of acceptedBlocks.values()) {
    //   console.log(id);
    // }

    acceptedBlocks.forEach((id) => {});
  };

  return (
    <TrackerContainer>
      <Title style={{ color: "inherit" }} level={4}>
        Zaznaczono {selected} z {schedulingResult.Solutions.length}
      </Title>
      <div>
        {checkBoxOptions.map((data) => (
          <Checkbox
            checked={data.checked}
            key={data.value + data.label}
            value={data.value}
            onChange={({ target }) => {
              if (!target.checked) removeBlocksWithIds(data.ids);
              else acceptBlocksWithIds(data.ids);
            }}
          >
            {data.label}
          </Checkbox>
        ))}
      </div>
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
          disabled={acceptedBlocks.size <= 0}
          onClick={() => confirm()}
          style={{ background: "transparent" }}
          icon={<CarryOutOutlined />}
        >
          Zatwierdź
        </Button>
        <Button
          onClick={() => clear()}
          style={{ background: "transparent" }}
          icon={<CarryOutOutlined />}
        >
          Anuluj
        </Button>
      </TrackerBtnContainer>
    </TrackerContainer>
  );
};
