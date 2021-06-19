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

        [Route("api/queries/one")]
        public IHttpActionResult GetQueryOne(string year)
        {
            var data = from reportingDates in finalCollection.ReportingDates
                       where reportingDates.reporting_date.Contains(year)
                       select new { reportDate = reportingDates.reporting_date };

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            } else
            {
                return NotFound();
            }
        }

        [Route("api/queries/two")]

        public IHttpActionResult GetQueryTwo(string year)
        {
            var data = from reportingDates in finalCollection.ReportingDates
                       join urate in finalCollection.UnemploymentRates on reportingDates.id equals urate.date_id into urateGroup
                       from item in urateGroup.DefaultIfEmpty()
                       where String.Compare(reportingDates.reporting_date.Substring(0,4), year) >= 0
                       select new { reportDate = reportingDates.reporting_date, rate = item == null ? 0 : item.unemployment_rate  };

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

        public IHttpActionResult GetQueryThree(string year)
        {
            var data = from dow in finalCollection.DowJones
                       where String.Compare(dow.ReportingDate.reporting_date.Substring(0, 4), year) >= 0
                       select new { reportDate = dow.ReportingDate.reporting_date, dowOpen = dow.open_value, dowClose = dow.close_value };

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
