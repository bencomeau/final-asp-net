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
        public IHttpActionResult QueryOne(string year)
        {
            var data = from reportingDates in finalCollection.ReportingDates
                       where reportingDates.reporting_date.Contains(year)
                       select reportingDates.reporting_date;

            if (data.Any())
            {
                return Json(new { data = data.ToList() });
            } else
            {
                return NotFound();
            }
        }

        [Route("api/queries/two")]

        public IHttpActionResult QueryTwo(string year)
        {
            var data = from reportingDates in finalCollection.ReportingDates
                       where reportingDates.reporting_date.Contains(year)
                       select reportingDates.reporting_date;

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

        public IHttpActionResult QueryThree(string year)
        {
            var data = from reportingDates in finalCollection.ReportingDates
                       where reportingDates.reporting_date.Contains(year)
                       select reportingDates.reporting_date;

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
