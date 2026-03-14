export default function StarRating({ rating, max = 5, onChange }) {
  return (
<div className='stars'>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
<span
          key={star}
          className={star <= rating ? 'star filled' : 'star'}
          onClick={() => onChange && onChange(star)}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
>
          ★
</span>
      ))}
</div>
  );
}
