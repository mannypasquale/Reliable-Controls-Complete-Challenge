//-----------------------------------------------------------------------------
// <copyright file="EventCounter.cs" company="Reliable Controls Corporation">
//   Copyright (C) Reliable Controls Corporation.  All rights reserved.
// </copyright>
//
// Description:
//      A simple event counter that mocks processing large inputs
//-----------------------------------------------------------------------------

namespace CodingChallengeWebBonus
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading;

    public class EventCounter : IEventCounter
    {
        private List<DeviceRecord> deviceEventList = new List<DeviceRecord>();

        /// <summary>
        /// Returns details of the given device
        /// </summary>
        /// <param name="deviceID">The given device ID</param>
        /// <returns>The current number of events</returns>
        public int GetEventCount(string deviceID)
        {
            DeviceRecord deviceRecord = this.deviceEventList.FirstOrDefault(d => d.DeviceID == deviceID);
            if (deviceRecord == null)
            {
                return -1;
            }

            return deviceRecord.EventCount;
        }

        /// <summary>
        /// Simulates processing a large file by slowly incrementing the count for the given device ID
        /// </summary>
        /// <param name="deviceID">The given device ID</param>
        /// <param name="eventLog">Not used</param>
        public void ParseEvents(string deviceID, StreamReader eventLog)
        {
            DeviceRecord deviceRecord = this.deviceEventList.FirstOrDefault(d => d.DeviceID == deviceID);

            if (deviceRecord == null)
            {
                deviceRecord = new DeviceRecord() { DeviceID = deviceID, EventCount = 0 };
                this.deviceEventList.Add(deviceRecord);
            }

            deviceRecord.IsProcessing = true;

            Random rand = new Random(DateTime.Now.Millisecond);

            for (int i = 0; i < 10; i++)
            {
                Thread.Sleep(rand.Next(500, 2000));
                deviceRecord.EventCount++;
            }

            deviceRecord.IsProcessing = false;
        }

        /// <summary>
        /// Returns the current list of device IDs
        /// </summary>
        /// <returns>A list of device IDs</returns>
        public List<DeviceRecord> GetIDs()
        {
            return this.deviceEventList;
        }
    }

    /// <summary>
    /// A simple class for storing Device IDs and their associated event counts.
    /// </summary>
    public class DeviceRecord
    {
        public string DeviceID { get; set; }
        public int EventCount { get; set; }
        public bool IsProcessing { get; set; }
    }
}
