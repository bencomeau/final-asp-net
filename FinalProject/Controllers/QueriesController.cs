using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FinalProject.Controllers
{
    public class QueriesController : ApiController
    {
        FinalEntities finalCollection = new FinalEntities();

        [Route("api/queries/reportingYears")]
        public IHttpActionResult GetReportingYears()
        {
            // The DOW is the limiting factor since we have more
            // steady data of the URATE, thus we limit result
            // years to those containing DOW data
            var data =
                (from reportingDates in finalCollection.ReportingDates
                 join dow in finalCollection.DowJones on reportingDates.id equals dow.date_id into dowGroup
                 from dowRecords in dowGroup
                 where dowRecords.open_value != null
                 select reportingDates.reporting_date.Substring(0, 4)).Distinct();

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            }
            else
            {
                return NotFound();
            }
        }

        [Route("api/queries/adi")]
        public IHttpActionResult GetADI()
        {
            var data =
                from adi in finalCollection.AverageDirectionalIndexes
                select adi.trend.Trim();

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            }
            else
            {
                return NotFound();
            }
        }

        [Route("api/queries/one")]
        public IHttpActionResult GetQueryOne(string year)
        {
            // Query for getting previous n years and showing the reporting date, the dow open/close, and urate
            var data =
                from reportingDates in finalCollection.ReportingDates
                join uRate in finalCollection.UnemploymentRates on reportingDates.id equals uRate.date_id into uRateGroup
                join dow in finalCollection.DowJones on reportingDates.id equals dow.date_id into dowGroup
                from item in uRateGroup.DefaultIfEmpty()
                from dowData in dowGroup.DefaultIfEmpty()
                where String.Compare(reportingDates.reporting_date.Substring(0, 4), year) >= 0
                select new
                {
                    reportDate = reportingDates.reporting_date,
                    unemploymentRate = item == null ? 0 : item.unemployment_rate,
                    dowOpen = dowData.open_value,
                    dowClose = dowData.close_value,
                    dowClosedHigher = dowData == null ? false : String.Compare(dowData.close_value, dowData.open_value) >= 0
                };

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            }
            else
            {
                return NotFound();
            }
        }

        [Route("api/queries/two")]

        public IHttpActionResult GetQueryTwo()
        {
            // Canned query to show the DOW data with ADI
            var data =
                from dow in finalCollection.DowJones
                select new {
                    dowOpen = dow.open_value,
                    dowClose = dow.close_value,
                    dowTrend = dow.AverageDirectionalIndex.trend,
                    reportDate = dow.ReportingDate.reporting_date
                };

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            }
            else
            {
                return NotFound();
            }
        }

        [Route("api/queries/three")]

        public IHttpActionResult GetQueryThree(string trend)
        {
            // User input to get the DOW with only weak, flat, or strong ADI
            var data =
                from dow in finalCollection.DowJones
                where dow.AverageDirectionalIndex.trend == trend
                select new {
                    dowOpen = dow.open_value,
                    dowClose = dow.close_value,
                    reportDate = dow.ReportingDate.reporting_date
                };

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            }
            else
            {
                return NotFound();
            }
        }
    }
}
