import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './orders.module.scss';
import Container from '../../components/UI/Container/Container';
import clsx from 'clsx';
import { useGetUserOrdersQuery } from '../../store/services';
import spinStyle from '../../components/LoaderTrigger/loadertrigger.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Language } from '../../types/Basket';
function Order() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const shopId = useSelector((state: RootState) => state.shop.shop?.id);
  const { data: transactions, isLoading } = useGetUserOrdersQuery(
    shopId || '',
    {
      skip: !shopId,
    },
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions
    ? transactions.orders.slice(startIndex, endIndex)
    : [];

  const totalShipped = paginatedTransactions.reduce(
    (sum, transaction) => sum + transaction.shipped,
    0,
  );
  const totalPaid = paginatedTransactions.reduce(
    (sum, transaction) => sum + transaction.paid,
    0,
  );
  const totalSum = paginatedTransactions.reduce(
    (sum, transaction) => sum + transaction.sum,
    0,
  );

  if (isLoading) {
    return (
      <div className={spinStyle.loader}>
        <div className={spinStyle.spinner} />
      </div>
    );
  }

  return (
    <Container
      styles={{ flexDirection: 'column' }}
      className={style.orderContainer}
    >
      <table className={style.ordersTable}>
        <thead>
          <tr>
            <th>{t('orders.table.number')}</th>
            <th>{t('orders.table.time')}</th>
            <th>{t('orders.table.client')}</th>
            <th>{t('orders.table.total')}</th>
            <th>{t('orders.table.paid')}</th>
            <th>{t('orders.table.shipped')}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className={style.idRow}>{transaction.id}</td>
              <td>
                <span className={style.rowDate}>
                  {new Date(transaction.time).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </td>
              <td className={style.agentRow}>
                {' '}
                {transaction.translate?.[i18n.language as Language] ||
                  transaction.agent}
              </td>
              <td className={style.value}>
                {transaction.sum.toFixed(2)}
                {transaction.sum > 0 && (
                  <span className={style.progressBar}></span>
                )}
              </td>
              <td className={style.paidRow}>
                {transaction.paid.toFixed(2)}
                {transaction.paid > 0 && (
                  <span className={style.progressBar}></span>
                )}
              </td>
              <td className={style.shippedRow}>
                {transaction.shipped.toFixed(2)}
                {transaction.shipped > 0 && (
                  <span className={style.progressBar}></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {paginatedTransactions.map((transaction) => (
        <div className={style.card} key={transaction.id}>
          <div className={style.header}>
            <span className={style.idRow}>
              <span>{t('orders.order_details.number')}</span> {transaction.id}
            </span>
            <div className={style.dateContainer}>
              <span className={style.dateLabel}>
                {t('orders.order_details.time')}
              </span>
              <div>
                <span className={style.rowDate}>
                  {' '}
                  {new Date(transaction.time).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className={style.divider} />

          <div className={clsx(style.row, style.clientRow)}>
            <span className={style.label}>
              {t('orders.order_details.client')}
            </span>

            <span className={style.agentRow}>
              {' '}
              {transaction.translate?.[i18n.language as Language] ||
                transaction.agent}
            </span>
          </div>

          <div className={style.divider} />

          <div className={style.row}>
            <span className={style.label}>
              {t('orders.order_details.total')}
            </span>
            <span className={style.value}>
              {totalSum.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className={style.divider} />

          <div className={style.row}>
            <span className={style.label}>
              {t('orders.order_details.paid')}
            </span>
            <span className={style.paidRow}>
              {totalPaid.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className={style.divider} />

          <div className={style.row}>
            <span className={style.label}>
              {t('orders.order_details.shipped')}
            </span>
            <span className={style.shippedRow}>
              {totalShipped.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      ))}

      <div className={style.result}>
        <div className={style.pagination}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={style.paginationButton}
          >
            {t('orders.pagination.first')}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={style.paginationButton}
          >
            {t('orders.pagination.prev')}
          </button>

          <span className={style.paginationCurrentPage}>
            {currentPage}–
            {Math.ceil((transactions?.orders.length || 0) / pageSize)}{' '}
            {t('orders.pagination.of')}{' '}
            {Math.ceil((transactions?.orders.length || 0) / pageSize)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endIndex >= (transactions?.orders.length || 0)}
            className={style.paginationButton}
          >
            {t('orders.pagination.next')}
          </button>
          <button
            onClick={() =>
              handlePageChange(
                Math.ceil((transactions?.orders.length || 0) / pageSize),
              )
            } // Переход к последней странице
            disabled={endIndex >= (transactions?.orders.length || 0)}
            className={style.paginationButton}
          >
            {t('orders.pagination.last')}
          </button>
        </div>
        <div className={style.resultSums}>
          <div>
            <span>{t('orders.summary.total')}</span>
            {totalSum.toLocaleString('ru-RU', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div>
            <span>{t('orders.summary.paid')}</span>
            {totalPaid.toLocaleString('ru-RU', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div>
            <span>{t('orders.summary.shipped')}</span>
            {totalShipped.toLocaleString('ru-RU', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Order;
