
export const Text = ({ text }: { text: string }) => (
  <div className="content-text" dangerouslySetInnerHTML={{ __html: text }} />
)

