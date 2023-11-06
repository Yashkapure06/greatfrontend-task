import React, { useState, useEffect } from 'react';

const Tooltip = ({ text, top, left }) => {
    return (
        <div
            className="absolute bg-gray-900 text-white py-1 px-2 rounded p-1 shadow-md"
            style={{ top, left }}
        >
            {text}
        </div>
    );
};

const Histogram = () => {
    const [data, setData] = useState([]);
    const [tooltip, setTooltip] = useState(null);
    const [hoveredBar, setHoveredBar] = useState(null);
    const [dataGenerated, setDataGenerated] = useState(false);

    const regenerateData = () => {
        fetch('https://www.random.org/integers/?num=200&min=1&max=10&col=1&base=10&format=plain&rnd=new')
            .then(response => response.text())
            .then(data => {
                const parsedData = data.split('\n').map(Number);
                setData(parsedData);
                setDataGenerated(true);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const numBins = 10;

    const binWidth = dataGenerated ? 100 / numBins : 0;
    const bins = Array.from({ length: numBins }, (_, i) => ({
        start: dataGenerated ? i * binWidth : 0,
        end: dataGenerated ? (i + 1) * binWidth : 0,
        count: 0,
    }));

    data.forEach((value) => {
        const binIndex = Math.floor(value / 10 * numBins);
        if (binIndex >= 0 && binIndex < numBins) {
            bins[binIndex].count++;
        }
    });

    const maxCount = Math.max(...bins.map((bin) => bin.count));

    const xLabels = Array.from({ length: numBins }).map((_, i) => ({
        label: i.toString(), // Start from 0
    }));

    return (
        <div className="flex mt-32 flex-col items-center">
            <div className="max-w-full bg-white rounded-lg shadow-2xl mt-24 p-4 md:p-6 relative">
                <div className="pb-4 mb-4">
                    <div className="grid grid-cols-10 gap-2">
                        {bins.map((bin, index) => (
                            <div key={index} className="relative mt-16">
                                <div
                                    className="absolute bottom-0 left-0 right-0 rounded cursor-pointer"
                                    style={{
                                        height: `${45 + (bin.count / maxCount) * (100 - 45)}px`,
                                        minHeight: '0px',
                                        background: hoveredBar === index
                                            ? 'rgba(255, 99, 132, 0.5)'
                                            : 'rgba(53, 162, 235, 0.5',
                                    }}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {hoveredBar === index && (
                                        <Tooltip
                                            text={`${bin.count}`}
                                            top={-20}
                                            left={0}
                                        />
                                    )}
                                </div>
                                <div className="text-center mt-2 relative text-white opacity-0">
                                    ({bin.start.toFixed(2)} - {bin.end.toFixed(2)})
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-600"></div>
                    <div className="absolute bottom-0 left-0 w-px h-full bg-gray-600"></div>
                    {xLabels.map((label, i) => (
                        <div
                            key={i}
                            className="absolute top-52 bottom-0 left-0"
                            style={{
                                left: `${i * (100 / numBins)}%`,
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <div className="text-center text-gray-600">
                                {label.label}
                            </div>
                        </div>
                    ))}
                    <div className="absolute -left-14 top-16 bottom-0 transform translateX(-50%) translatey(-50%)">
                        <div className="text-center transform rotate-90 mt-2 text-gray-600">
                            Frequency
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-24">
                <button
                    onClick={regenerateData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-600"
                >
                    Regenerate Data
                </button>
            </div>
        </div>
    );
};

export default Histogram;
