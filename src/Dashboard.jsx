import { useState, useEffect } from "react";
import ParameterList from "./ParameterList";
import Slider from "rc-slider";
import ChartContainer from "./ChartContainer";
import { HiDocumentText } from "react-icons/hi2";
import ExcelReader, { parseExcelData } from "./ExcelReader";
import params from "./constants/params";
import "rc-slider/assets/index.css";
import { MdFileUpload } from "react-icons/md";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const EXISTING_FILE_NAME = "sample.xlsx";
const EXCEL_FILE_PATH = `/${EXISTING_FILE_NAME}`;

function Dashboard() {
  const [chartType, setChartType] = useState('line');
  const handleChartTypeToggle = (event) => {
    setChartType(event.target.checked ? 'bar' : 'line');
  };
  const [mode, setMode] = useState(null);
  const [selectedParams, setSelectedParams] = useState([]);
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([0, 0]);
  const [allDates, setAllDates] = useState([]);

  const toggleParam = (param) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const applyDateFilter = (data, range, dates) => {
    const [startIdx, endIdx] = range;
    const startDate = dates[startIdx];
    const endDate = dates[endIdx];
    const filtered = data.filter((entry) => {
      const date = entry.date;
      return dayjs(date).isSameOrAfter(startDate) && dayjs(date).isSameOrBefore(endDate);
    });
    setFilteredData(filtered);
  };

  const handleDataLoaded = (parsedData, name) => {
    if (parsedData && parsedData.length > 0) {
      setExcelData(parsedData);
      setFileName(name);
      const dates = parsedData.map((entry) => entry.date);
      setAllDates(dates);
      setDateRange([0, dates.length - 1]);
      setFilteredData(parsedData);
      setMode("data_loaded"); // Set a generic mode for both cases
    } else {
      console.warn("Parsed data is empty.");
      setExcelData([]);
      setFilteredData([]);
      setMode(null);
    }
  };

  const loadExistingData = async () => {
    setLoading(true);
    try {
      const response = await fetch(EXCEL_FILE_PATH);
      if (!response.ok) {
        throw new Error(`Failed to load file. Status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const parsedData = parseExcelData(arrayBuffer, params);
      handleDataLoaded(parsedData, EXISTING_FILE_NAME);
    } catch (error) {
      console.error("Error loading existing data:", error);
      setExcelData([]);
      setFilteredData([]);
      setMode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (excelData.length && allDates.length) {
      applyDateFilter(excelData, dateRange, allDates);
    }
  }, [dateRange, excelData, allDates]);

  const modeButtons = document.querySelectorAll('.mode-button');
  const title= document.querySelectorAll('h1');

  useEffect(() => {
    if (mode) {
      document.body.style.backgroundImage = "url('/bg2.png')";
      modeButtons.forEach(button => {
        button.style.width = "12vw";
        button.style.height = "12vw";
        button.style.fontSize = "0.88rem";
        button.style.marginBottom = "4vw";
      });
      title.forEach(button => {
        button.style.marginBottom = "7vw";
        button.style.fontSize = "3rem";
      });
    } 
    return () => {
    };
  }, [mode]);

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <h1>Production Analysis</h1>
      </div>

      <div className="button-group">
        <label htmlFor="file-upload" className="mode-button">
          <div className="icon-label">
            <MdFileUpload size={60}/>
            <ExcelReader
              onDataLoaded={(data) => handleDataLoaded(data, data.fileName)} 
              setFileName={setFileName}
            />
            <span>{fileName ? `Using: ${fileName}` : "Upload Data"}</span>
          </div>
        </label>

        <div onClick={loadExistingData} className="mode-button">
          <div className="icon-label">
            <HiDocumentText size={48} />
            <span>{loading ? "Loading..." : "Use Sample Data"}</span>
          </div>
        </div>
      </div>

      {mode && (
        <>
          <div style={{ margin: "auto", width: "85%", marginBottom:"2vw"}}>
          <ParameterList
            parameters={params}
            selected={selectedParams}
            onToggle={toggleParam}
          />
          </div>
          <div className="toggle-button-cover">
            <div id="button-3" className="button r">
              <input className="checkbox" type="checkbox" onChange={handleChartTypeToggle} checked={chartType === 'bar'}/>
              <div className="knobs"/>
              <div className="layer"/>
            </div>
          </div>
        <div style={{ margin: "0vw", width: "75%", marginBottom:"2vw", marginTop:"0vw"}}>
          <div style={{ marginBottom: 5, fontWeight: "700", color: "#000000ff", fontSize: "1.4rem", fontFamily: "Garamond" }}>
            From: {allDates[dateRange[0]]} &nbsp; | &nbsp; To: {allDates[dateRange[1]]}
          </div>
          <div className="slider">
          <Slider
            range
            min={0}
            max={allDates.length - 1}
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            trackStyle={[{ backgroundColor: "#27b039ff", height: 12 }]}
            handleStyle={[
              { borderColor: "#152b99", backgroundColor: "#fff", height: 24, width: 24, marginTop: -7 },
              { borderColor: "#152b99", backgroundColor: "#fff", height: 24, width: 24, marginTop: -7 },
            ]}
            railStyle={{ backgroundColor: "#ccc", height: 12 }}
          />
          </div>
        </div>
        <ChartContainer selected={selectedParams} data={filteredData} chartType={chartType}/>
        </>
      )}


    </div>
  );
}

export default Dashboard;