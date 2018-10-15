//-----------------------------------------------------------------------------
// <copyright file="EventCounter.cs" company="Reliable Controls Corporation">
//   Copyright (C) Reliable Controls Corporation.  All rights reserved.
// </copyright>
//
// Description:
//      A simple API that gets and creates artificial data with artificial delays
//-----------------------------------------------------------------------------

namespace CodingChallengeWebBonus.Controllers
{
    using Microsoft.AspNetCore.Cors;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    public class EventsController : Controller
    {
        public static EventCounter eventCounter = new EventCounter();

        /// <summary>
        /// GET api/events
        /// 
        /// Gets a list of all processed devices and associated information
        /// </summary>
        /// <returns>A list of strings</returns>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(eventCounter.GetIDs());
        }

        /// <summary>
        /// GET api/events/HV5
        /// 
        /// Gets details for the given device ID
        /// Ex:
        ///     {
        ///         "deviceID": "HV2",
        ///         "eventCount": 20,
        ///         "isProcessing": false
        ///     }
        /// </summary>
        /// <param name="id">ID of a specific device (ex: "HV5")</param>
        /// <returns>A single integer</returns>
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            int count =  eventCounter.GetEventCount(id);
            if (count == -1)
            {
                return NotFound();
            }

            return Ok(count);
        }

        /// <summary>
        /// POST api/events/HV5
        /// 
        /// Simulates processing a large amount of data for the given device ID.
        /// This action either creates a new device ID entry, or updates an existing one
        /// </summary>
        /// <param name="id">ID of a specific device (ex: "HV5")</param>
        /// <returns>Nothing</returns>
        [HttpPost("{id}")]
        public IActionResult Post(string id)
        {
            eventCounter.ParseEvents(id, null);
            return Ok();
        }
    }
}
