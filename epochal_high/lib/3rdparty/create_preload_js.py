#!/usr/bin/env python

"""
Module docstring.
"""

import sys, os, optparse

items = (
    "highlight",
    "greensock/src/uncompressed/plugins",
    "greensock/src/uncompressed/TweenLite.js",
    "convertPointFromPageToNode.js"
)

def process_command_line(argv):
    """
    Return a 2-tuple: (settings object, args list).
    `argv` is a list of arguments, or `None` for ``sys.argv[1:]``.
    """
    if argv is None:
        argv = sys.argv[1:]

    # initialize the parser object:
    parser = optparse.OptionParser(
        formatter=optparse.TitledHelpFormatter(width=78),
        add_help_option=None)

    # define options here:
    parser.add_option(      # customized description; put --help last
        '-h', '--help', action='help',
        help='Show this help message and exit.')

    settings, args = parser.parse_args(argv)

    # check number of arguments, verify values, etc.:
    if args:
        parser.error('program takes no command-line arguments; '
                     '"%s" ignored.' % (args,))

    # further process settings & args if necessary

    return settings, args

def main(argv=None):
    settings, args = process_command_line(argv)
    run(settings, args)
    return 0        # success

def run(settings, args):
    with open("preload.js", 'w') as outfile:
        for item in items:
            if item.endswith(".js"):
                appendFile(outfile, item)
            else:
                for filename in os.listdir(item):
                    if filename.endswith(".js"):
                        appendFile(outfile, os.path.join(item, filename))

def appendFile(outfile, filename):
    with open(filename) as infile:
        outfile.write("\n")
        outfile.write(infile.read())
        print("File appended: " + infile.name)

if __name__ == '__main__':
    status = main()
    sys.exit(status)
