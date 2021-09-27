/** Removing the special IO signs from the program.
    Case1: 
      &gt;&gt;&gt;
    Case2:
      ... 
    Args:
      code: a string, the code snippet.
    Returns:
      repaired_code: a string, the repaired code snippet. */
export function repair_program_io(code) {

  // reg patterns
  const pattern_case_1 = new RegExp("&gt;&gt;&gt;")
  // const pattern_case_2 = new RegExp("\\.\.\.")
  // const pattern_case_3 = new RegExp("In [\d]:")
  // const pattern_case_4 = new RegExp("Out [\d]:")
  // const pattern_case_5 = new RegExp("( )+\.+:")
  // const pattern_case_6 = new RegExp(">>>")

  const patterns = [pattern_case_1]

  const lines = code.split("\n")

  let repaired_code = ""

  for (let line of lines) {
    let repaired_line = line
    for (let pattern of patterns) {
      if (repaired_line.match(pattern)) {
        repaired_line = repaired_line.replace(pattern, "")
      }
    }
    repaired_code += repaired_line + "\n"
  }

  return repaired_code
}
