#!/usr/bin/env python3
"""
Confidence intervals example for the Upstream SDK.

Demonstrates:
1. Retrieving measurements with confidence intervals
2. Using different aggregation intervals
3. Analyzing the aggregated data

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python confidence-intervals.py
"""

from datetime import datetime

from upstream_sdk import UpstreamClient


def main():
    # Initialize client
    client = UpstreamClient.from_environment()

    # Replace with your actual IDs
    campaign_id = 123
    station_id = 456
    sensor_id = 789

    # --- 1. Hourly aggregation ---
    print("=== Hourly aggregation ===")

    hourly = client.measurements.get_with_confidence_intervals(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
        interval="hour",
        interval_value=1,
        start_date=datetime(2025, 6, 1),
        end_date=datetime(2025, 6, 2),
    )

    print(f"Got {len(hourly)} hourly data points")
    for point in hourly[:5]:
        print(
            f"  {point.timestamp}: "
            f"mean={point.mean:.2f} "
            f"[{point.lower_bound:.2f}, {point.upper_bound:.2f}]"
        )
    print()

    # --- 2. 6-hour aggregation ---
    print("=== 6-hour aggregation ===")

    six_hourly = client.measurements.get_with_confidence_intervals(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
        interval="hour",
        interval_value=6,
        start_date=datetime(2025, 6, 1),
        end_date=datetime(2025, 6, 7),
    )

    print(f"Got {len(six_hourly)} 6-hour data points")
    for point in six_hourly[:5]:
        print(
            f"  {point.timestamp}: "
            f"mean={point.mean:.2f} "
            f"[{point.lower_bound:.2f}, {point.upper_bound:.2f}]"
        )
    print()

    # --- 3. Daily aggregation ---
    print("=== Daily aggregation ===")

    daily = client.measurements.get_with_confidence_intervals(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
        interval="day",
        interval_value=1,
        start_date=datetime(2025, 6, 1),
        end_date=datetime(2025, 6, 30),
    )

    print(f"Got {len(daily)} daily data points")
    for point in daily[:5]:
        ci_width = point.upper_bound - point.lower_bound
        print(
            f"  {point.timestamp}: "
            f"mean={point.mean:.2f} "
            f"CI width={ci_width:.2f}"
        )
    print()

    # --- 4. Compute basic statistics from confidence intervals ---
    if daily:
        means = [p.mean for p in daily]
        ci_widths = [p.upper_bound - p.lower_bound for p in daily]

        print("=== Summary statistics ===")
        print(f"  Period: {daily[0].timestamp} to {daily[-1].timestamp}")
        print(f"  Mean of daily means: {sum(means)/len(means):.2f}")
        print(f"  Min daily mean: {min(means):.2f}")
        print(f"  Max daily mean: {max(means):.2f}")
        print(f"  Average CI width: {sum(ci_widths)/len(ci_widths):.2f}")

    print("\nDone!")


if __name__ == "__main__":
    main()
