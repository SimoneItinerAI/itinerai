import { useSelector, useDispatch } from 'react-redux'
import { removeToast, Toast as ToastType } from '../../store/slices/uiSlice'
import { RootState } from '../../store'

export function Toast() {
  const toasts = useSelector((s: RootState) => s.ui.toasts)
  const dispatch = useDispatch()
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toasts.map((t: ToastType) => (
        <div key={t.id} className="bg-neutral-900 text-white px-3 py-2 rounded shadow">
          <div className="flex items-center gap-2">
            <span>{t.message}</span>
            <button className="text-sm" onClick={() => dispatch(removeToast(t.id))}>×</button>
          </div>
        </div>
      ))}
    </div>
  )
}
