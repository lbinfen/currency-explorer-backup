using System.Collections.Generic;
using System.Linq;

namespace wallet.Models
{
    public class PagedResult
    {
        public static PagedResult<T> Create<T>(IEnumerable<T> data, int total)
        {
            return new PagedResult<T>() { Data = data, Total = total };
        }

        public static PagedResult<T> Empty<T>()
        {
            return new PagedResult<T>();
        }
    }

    public class PagedResult<T> : PagedResult
    {
        public int Total { get; set; }

        public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();
    }
}