import React from 'react';

const ConfidenceMethodExplanation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-primary-800">
        Understanding Confidence Intervals in Sensor Data Visualization
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">
          What are Confidence Intervals?
        </h2>
        <p className="mb-4">
          Confidence intervals represent the reliability of an estimate. When
          visualizing sensor measurements, confidence intervals help you
          understand the reliability of the average (mean) value displayed. The
          LineConfidenceViz component shows these intervals as shaded areas
          around the main line.
        </p>
        <p className="mb-4">
          All confidence intervals displayed in the visualization represent a
          95% confidence level, meaning we can be 95% confident that the true
          value falls within the displayed range.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">
          Types of Confidence Intervals
        </h2>
        <p className="mb-4">
          The visualization uses two complementary methods to calculate
          confidence intervals:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-medium mb-2 text-primary-600">
            1. Percentile-based Intervals
          </h3>
          <p className="mb-2">
            These are displayed as{' '}
            <span className="font-semibold">lower_bound</span> and{' '}
            <span className="font-semibold">upper_bound</span> in the data.
          </p>
          <ul className="list-disc pl-6 mb-2">
            <li>Based on the actual distribution of data points</li>
            <li>Lower bound corresponds to the 2.5th percentile</li>
            <li>Upper bound corresponds to the 97.5th percentile</li>
            <li>Reflects the spread of actual measurements</li>
          </ul>
          <p>
            These intervals make no assumptions about the data distribution and
            are purely based on the observed values.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-2 text-primary-600">
            2. Parametric Intervals
          </h3>
          <p className="mb-2">
            These are displayed as{' '}
            <span className="font-semibold">parametric_lower_bound</span> and{' '}
            <span className="font-semibold">parametric_upper_bound</span> in the
            data.
          </p>
          <ul className="list-disc pl-6 mb-2">
            <li>Calculated using statistical theory and the t-distribution</li>
            <li>Adapts to the sample size for better accuracy</li>
            <li>Formula: mean ± (t-value × standard error)</li>
          </ul>
          <p className="mb-2">
            The multiplier (t-value) adjusts based on the number of data points:
          </p>
          <table className="w-full border-collapse border border-gray-300 mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Sample Size</th>
                <th className="border border-gray-300 p-2">t-value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">30+ data points</td>
                <td className="border border-gray-300 p-2">
                  1.96 (normal distribution)
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  20-29 data points
                </td>
                <td className="border border-gray-300 p-2">2.09</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  10-19 data points
                </td>
                <td className="border border-gray-300 p-2">2.23</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Fewer than 10 points
                </td>
                <td className="border border-gray-300 p-2">2.58</td>
              </tr>
            </tbody>
          </table>
          <p>
            These intervals assume the data follows a normal distribution and
            are more appropriate when this assumption holds.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ConfidenceMethodExplanation;
